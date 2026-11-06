<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoF\NotaFiscalRepository;
use App\Repositories\GrupoF\PeriodoRepository;
use App\Services\TenantContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class NotaFiscalSaidaApiController extends Controller
{
    public function __construct(
        private NotaFiscalRepository $notas,
        private PeriodoRepository $periodos,
        private TenantContext $tenant,
    ) {}

    public function index()
    {
        return response()->json($this->notas->porDirecao('Saida'));
    }

    public function show(int $id)
    {
        return response()->json($this->notas->porIdComItensEImpostos($id));
    }

    public function store(Request $request)
    {
        $data = $this->validar($request);
        $filialId = $this->tenant->getFilialId();

        if ($filialId === null) {
            return response()->json(['message' => 'Contexto de filial ausente.'], 422);
        }

        if (! empty($data['chave']) && $this->notas->porChave($data['chave']) !== null) {
            throw ValidationException::withMessages([
                'chave' => 'Já existe uma nota com esta chave.',
            ]);
        }

        $mesAno = $this->mesAnoDe($data['data_emissao']);
        $periodo = $this->periodos->porFilialEMesAno($filialId, $mesAno);

        if ($periodo === null || $periodo->status !== 'Aberto') {
            throw ValidationException::withMessages([
                'data_emissao' => "Período {$mesAno} não está aberto para a filial.",
            ]);
        }

        $data['id_filial'] = $filialId;
        $data['id_periodo'] = $periodo->id;
        $data['direcao'] = 'Saida';
        $data['origem'] = 'Propria';
        $data['status_importacao'] = 'Importado';

        $nota = DB::transaction(fn () => $this->notas->criarComItens($data));

        return response()->json($nota, 201);
    }

    public function update(Request $request, int $id)
    {
        $nota = $this->notas->porId($id);

        if ($nota->status_importacao !== 'Importado') {
            throw ValidationException::withMessages([
                'status_importacao' => 'Só é possível editar notas com status "Importado".',
            ]);
        }

        $periodo = $this->periodos->porId((int) $nota->id_periodo);
        if ($periodo->status !== 'Aberto') {
            throw ValidationException::withMessages([
                'id_periodo' => 'Período da nota está fechado.',
            ]);
        }

        $data = $this->validar($request, $id);

        if (! empty($data['chave']) && $data['chave'] !== $nota->chave && $this->notas->porChave($data['chave']) !== null) {
            throw ValidationException::withMessages([
                'chave' => 'Já existe outra nota com esta chave.',
            ]);
        }

        unset($data['id_filial'], $data['id_periodo'], $data['direcao'], $data['origem'], $data['status_importacao']);

        $nota = DB::transaction(fn () => $this->notas->atualizarComItens($id, $data));

        return response()->json($nota);
    }

    public function destroy(int $id)
    {
        $nota = $this->notas->porId($id);

        if ($nota->status_importacao !== 'Importado') {
            throw ValidationException::withMessages([
                'status_importacao' => 'Só é possível excluir notas com status "Importado".',
            ]);
        }

        DB::transaction(function () use ($nota) {
            $nota->forceFill(['deleted_by' => $this->tenant->getUsuarioId()])->save();
            $nota->delete();
        });

        return response()->noContent();
    }

    public function salvarRascunho(Request $request)
    {
        $data = $this->validar($request);
        $filialId = $this->tenant->getFilialId();

        if ($filialId === null) {
            return response()->json(['message' => 'Contexto de filial ausente.'], 422);
        }

        $mesAno = $this->mesAnoDe($data['data_emissao']);
        $periodo = $this->periodos->porFilialEMesAno($filialId, $mesAno);

        if ($periodo === null || $periodo->status !== 'Aberto') {
            throw ValidationException::withMessages([
                'data_emissao' => "Período {$mesAno} não está aberto para a filial.",
            ]);
        }

        $data['id_filial'] = $filialId;
        $data['id_periodo'] = $periodo->id;
        $data['direcao'] = 'Saida';
        $data['origem'] = 'Propria';
        $data['status_importacao'] = 'Importado';
        $data['dados_extras'] = array_merge(
            $data['dados_extras'] ?? [],
            ['rascunho' => true],
        );

        $nota = DB::transaction(fn () => $this->notas->criarComItens($data));

        return response()->json($nota, 201);
    }

    public function confirmar(int $id)
    {
        $nota = $this->notas->porId($id);

        if ($nota->status_importacao !== 'Importado') {
            throw ValidationException::withMessages([
                'status_importacao' => 'Nota não está em status editável.',
            ]);
        }

        $extras = is_array($nota->dados_extras) ? $nota->dados_extras : [];
        if (empty($extras['rascunho'])) {
            throw ValidationException::withMessages([
                'dados_extras' => 'Esta nota não é um rascunho.',
            ]);
        }

        $extras['rascunho'] = false;
        $nota->forceFill(['dados_extras' => $extras])->save();

        return response()->json($nota->refresh());
    }

    private function mesAnoDe(string $data): string
    {
        return substr($data, 5, 2).'/'.substr($data, 0, 4);
    }

    private function validar(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'id_tipo_documento' => 'required|integer|exists:tipos_documento,id',
            'chave' => 'nullable|string|size:44',
            'numero' => 'required|string|max:20',
            'serie' => 'nullable|string|max:10',
            'data_emissao' => 'required|date',
            'id_pessoa_emitente' => 'nullable|integer|exists:pessoas,id',
            'id_pessoa_destinatario' => 'required|integer|exists:pessoas,id',
            'id_municipio_emissao' => 'nullable|integer|exists:municipios,id',
            'valor_produtos' => 'nullable|numeric|min:0',
            'valor_desconto' => 'nullable|numeric|min:0',
            'valor_frete' => 'nullable|numeric|min:0',
            'valor_total' => 'required|numeric|min:0',
            'xml_origem' => 'nullable|string',
            'dados_extras' => 'nullable|array',

            'itens' => 'required|array|min:1',
            'itens.*.numero_item' => 'required|integer|min:1',
            'itens.*.descricao' => 'required|string|max:300',
            'itens.*.id_produto_servico' => 'nullable|integer|exists:produtos_servicos,id',
            'itens.*.id_cfop' => 'nullable|integer|exists:cfops,id',
            'itens.*.id_ncm' => 'nullable|integer|exists:ncms,id',
            'itens.*.id_servico_lc116' => 'nullable|integer|exists:servicos_lc116,id',
            'itens.*.quantidade' => 'required|numeric|min:0.0001',
            'itens.*.valor_unitario' => 'required|numeric|min:0',
            'itens.*.valor_total' => 'required|numeric|min:0',
            'itens.*.valor_desconto' => 'nullable|numeric|min:0',
            'itens.*.valor_frete' => 'nullable|numeric|min:0',
            'itens.*.valor_seguro' => 'nullable|numeric|min:0',
            'itens.*.outras_despesas' => 'nullable|numeric|min:0',
            'itens.*.custo_unitario' => 'nullable|numeric|min:0',

            'itens.*.impostos' => 'nullable|array',
            'itens.*.impostos.*.tipo_imposto' => 'required_with:itens.*.impostos|string|max:20',
            'itens.*.impostos.*.id_cst' => 'nullable|integer|exists:csts,id',
            'itens.*.impostos.*.base_calculo' => 'nullable|numeric|min:0',
            'itens.*.impostos.*.aliquota' => 'nullable|numeric|min:0',
            'itens.*.impostos.*.valor' => 'required_with:itens.*.impostos|numeric',
            'itens.*.impostos.*.valor_st' => 'nullable|numeric|min:0',
        ]);
    }
}
