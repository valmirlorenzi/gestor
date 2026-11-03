<?php

namespace App\Repositories\GrupoC;

use App\Models\ContaPagar;
use App\Models\ContaReceber;
use App\Models\DocumentoEncadeado;
use App\Models\Filial;
use App\Models\Lancamento;
use App\Models\NotaFiscal;
use App\Repositories\BaseRepository;
use App\Services\TenantContext;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

/**
 * Grupo C: polimórfico disfarçado (P48).
 * id_documento_origem / id_documento_destino apontam para tabelas
 * diferentes conforme tipo_relacao. A coerência de empresa é
 * validada AQUI, não no banco.
 */
class DocumentoEncadeadoRepository extends BaseRepository
{
    /** Mapa: prefixo do tipo_relacao → model de origem/destino. */
    private const MAPA_DOCUMENTO = [
        'NF-e' => NotaFiscal::class,
        'CT-e' => NotaFiscal::class,
        'NFS-e' => NotaFiscal::class,
        'RPA' => NotaFiscal::class,
        'conta_pagar' => ContaPagar::class,
        'conta_receber' => ContaReceber::class,
        'lancamento' => Lancamento::class,
    ];

    public function __construct(
        DocumentoEncadeado $model,
        private TenantContext $tenant,
    ) {
        parent::__construct($model);
    }

    public function porDocumentoOrigem(int $idDocumento): Collection
    {
        return $this->query()
            ->where('id_documento_origem', $idDocumento)
            ->get();
    }

    public function porDocumentoDestino(int $idDocumento): Collection
    {
        return $this->query()
            ->where('id_documento_destino', $idDocumento)
            ->get();
    }

    /**
     * Cria o vínculo validando que origem e destino pertencem à mesma
     * empresa do contexto. P48.
     */
    public function create(array $data): DocumentoEncadeado
    {
        $this->validarMesmaEmpresa(
            (int) $data['id_documento_origem'],
            (int) $data['id_documento_destino'],
            (string) $data['tipo_relacao']
        );

        /** @var DocumentoEncadeado $de */
        $de = parent::create($data);

        return $de;
    }

    private function validarMesmaEmpresa(int $idOrigem, int $idDestino, string $tipoRelacao): void
    {
        $idEmpresaContexto = $this->tenant->getId();

        if ($idEmpresaContexto === null) {
            throw ValidationException::withMessages([
                'tenant' => 'Contexto de empresa ausente.',
            ]);
        }

        $empresaOrigem = $this->empresaDoDocumento($idOrigem, $tipoRelacao, 'origem');
        $empresaDestino = $this->empresaDoDocumento($idDestino, $tipoRelacao, 'destino');

        if ($empresaOrigem !== $idEmpresaContexto || $empresaDestino !== $idEmpresaContexto) {
            throw ValidationException::withMessages([
                'id_documento_origem' => 'Documento(s) pertence(m) a outra empresa (P48).',
            ]);
        }
    }

    private function empresaDoDocumento(int $id, string $tipoRelacao, string $lado): int
    {
        $modelClass = $this->resolverModel($tipoRelacao, $lado);

        /** @var Model|null $doc */
        $doc = $modelClass::withoutGlobalScope('tenant')->find($id);

        if ($doc === null) {
            throw ValidationException::withMessages([
                "id_documento_{$lado}" => "Documento {$id} inexistente.",
            ]);
        }

        // NotaFiscal, ContaPagar, ContaReceber, Lancamento são Grupo F:
        // empresa herdada via filial.
        $idFilial = $doc->id_filial ?? null;

        if ($idFilial === null) {
            throw ValidationException::withMessages([
                "id_documento_{$lado}" => "Documento {$id} sem filial.",
            ]);
        }

        $idEmpresa = Filial::withoutGlobalScope('tenant')
            ->where('id', $idFilial)
            ->value('id_empresa');

        if ($idEmpresa === null) {
            throw ValidationException::withMessages([
                "id_documento_{$lado}" => "Filial do documento {$id} inexistente.",
            ]);
        }

        return (int) $idEmpresa;
    }

    private function resolverModel(string $tipoRelacao, string $lado): string
    {
        // tipo_relacao no DDL é algo como "NF-e entrada -> conta a pagar".
        // Extrai o prefixo de origem/destino.
        $partes = array_map('trim', explode('->', $tipoRelacao));

        if (count($partes) !== 2) {
            throw ValidationException::withMessages([
                'tipo_relacao' => 'tipo_relacao deve ter o formato "origem -> destino".',
            ]);
        }

        $alvo = $lado === 'origem' ? $partes[0] : $partes[1];

        // Mapeia para o model de maior granularidade disponível.
        foreach (self::MAPA_DOCUMENTO as $chave => $classe) {
            if (stripos($alvo, $chave) !== false) {
                return $classe;
            }
        }

        throw ValidationException::withMessages([
            'tipo_relacao' => "Não foi possível resolver o model para '{$alvo}'.",
        ]);
    }
}
