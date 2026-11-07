<?php

namespace App\Importacoes;

use App\Http\Controllers\Api\NotaFiscalApiController;
use App\Models\NotaFiscal;
use App\Repositories\GrupoA\PessoaRepository;
use App\Repositories\GrupoF\LogImportacaoRepository;
use App\Repositories\GrupoF\NotaFiscalRepository;
use App\Repositories\GrupoU\CfopRepository;
use App\Repositories\GrupoU\CstRepository;
use App\Repositories\GrupoU\NcmRepository;
use App\Repositories\GrupoU\ServicoLc116Repository;
use App\Repositories\GrupoU\TipoDocumentoRepository;
use App\Services\TenantContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Orquestra o motor B: resolve FKs do payload do parser, chama o store()
 * reaproveitado do NotaFiscalApiController, grava em logs_importacao e
 * dispara os hooks do Bloco 13 (TODO — vazios na fase 1).
 */
final class DocumentoService
{
    public function __construct(
        private NotaFiscalRepository $notas,
        private LogImportacaoRepository $logs,
        private PessoaRepository $pessoas,
        private TipoDocumentoRepository $tipos,
        private CfopRepository $cfops,
        private NcmRepository $ncms,
        private CstRepository $csts,
        private ServicoLc116Repository $servicosLc116,
        private TenantContext $ctx,
    ) {}

    /**
     * Resolve FKs, chama store() e grava log/auditoria.
     * Lança RuntimeException em caso de store inválido (vira rejeitada no caller).
     */
    public function processar(array $parseado, array $meta, int $idFilial, ?string $caminhoArquivo = null): NotaFiscal
    {
        $payload = $this->resolverFks($parseado['payload'], $meta);

        return DB::transaction(function () use ($payload, $meta, $idFilial, $caminhoArquivo) {
            // 1) store() reaproveitado
            $request = Request::create('/api/notas-fiscais', 'POST', $payload);
            $request->headers->set('Accept', 'application/json');
            $controllerClass = $meta['controller'] ?? NotaFiscalApiController::class;
            $response = app($controllerClass)->store($request);
            if ($response->getStatusCode() !== 201) {
                throw new \RuntimeException('store() retornou '.$response->getStatusCode());
            }
            $nota = $response->getData(true);
            $notaId = (int) $nota['id'];

            // 2) log operacional (1 linha por documento)
            $this->logs->create([
                'id_filial' => $idFilial,
                'tipo_documento' => $meta['tipo_documento'],
                'caminho_arquivo' => $caminhoArquivo,
                'status' => 'Importado',
                'mensagem' => null,
                'created_at' => now(),
            ]);

            // 3) hooks (TODO Bloco 13 — vazios na fase 1)
            $this->classificar($notaId);
            $this->calcularImpostos($notaId);
            $this->gerarContaPagar($notaId);
            $this->gerarTarefa($notaId);
            $this->gerarPendencia($notaId);
            $this->gerarRazaoImposto($notaId);

            return NotaFiscal::findOrFail($notaId);
        });
    }

    /** Resolve CNPJ/CNPJ emitente, id_tipo_documento, cfop, ncm, cst, município. */
    private function resolverFks(array $payload, array $meta): array
    {
        $payload['id_tipo_documento'] = $this->tipos->porCodigo($meta['tipo_documento'])?->id
            ?? throw new \RuntimeException("TipoDocumento '{$meta['tipo_documento']}' não encontrado.");

        if (($meta['direcao'] ?? 'Entrada') === 'Saida') {
            // Saída: a empresa é a emitente (filial); o destinatário é obrigatório.
            $payload['id_pessoa_emitente'] = null;
            $payload['id_pessoa_destinatario'] = $this->pessoas->porDocumento($payload['_cnpj_destinatario'])?->id
                ?? throw new \RuntimeException('Destinatário (CNPJ/CPF) não cadastrado.');
        } else {
            // Entrada: a empresa é a destinatária; o emitente é obrigatório.
            $payload['id_pessoa_emitente'] = $this->pessoas->porDocumento($payload['_cnpj_emitente'])?->id
                ?? throw new \RuntimeException('Emitente (CNPJ/CPF) não cadastrado.');
            $payload['id_pessoa_destinatario'] = $this->pessoas->porDocumento($payload['_cnpj_destinatario'])?->id;
        }
        // itens: resolve cfop/ncm/cst
        foreach ($payload['itens'] as &$item) {
            if (! empty($item['_codigo_cfop'])) {
                $item['id_cfop'] = $this->cfops->porCodigo($item['_codigo_cfop'])?->id;
            }
            if (! empty($item['_codigo_ncm'])) {
                $item['id_ncm'] = $this->ncms->porCodigo($item['_codigo_ncm'])?->id;
            }
            if (! empty($item['_codigo_servico_lc116'])) {
                $item['id_servico_lc116'] = $this->servicosLc116->porCodigo($item['_codigo_servico_lc116'])?->id;
            }
            foreach ($item['impostos'] as &$imp) {
                if (! empty($imp['_cst_codigo'])) {
                    $imp['id_cst'] = $this->csts->porCodigo($imp['_cst_codigo'])?->id;
                }
                unset($imp['_cst_codigo']);
            }
            unset($imp);
            unset(
                $item['_codigo_cfop'],
                $item['_codigo_ncm'],
                $item['_codigo_servico_lc116'],
                $item['_codigo_servico_municipal'],
            );
        }
        unset($item);

        unset($payload['_cnpj_emitente'], $payload['_cnpj_destinatario'], $payload['_codigo_municipio_emissao']);

        return $payload;
    }

    private function classificar(int $notaId): void
    { /* TODO(Bloco 13) */
    }

    private function calcularImpostos(int $notaId): void
    { /* TODO(Bloco 13) */
    }

    private function gerarContaPagar(int $notaId): void
    { /* TODO(Bloco 13) */
    }

    private function gerarTarefa(int $notaId): void
    { /* TODO(Bloco 13) */
    }

    private function gerarPendencia(int $notaId): void
    { /* TODO(Bloco 13) */
    }

    private function gerarRazaoImposto(int $notaId): void
    { /* TODO(Bloco 13) */
    }
}
