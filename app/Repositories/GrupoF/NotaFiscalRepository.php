<?php

namespace App\Repositories\GrupoF;

use App\Models\NotaFiscal;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class NotaFiscalRepository extends BaseRepository
{
    public function __construct(NotaFiscal $model)
    {
        parent::__construct($model);
    }

    public function porChave(string $chave): ?NotaFiscal
    {
        return $this->query()->where('chave', $chave)->first();
    }

    public function porFilial(int $idFilial): Collection
    {
        return $this->query()
            ->where('id_filial', $idFilial)
            ->orderByDesc('data_emissao')
            ->get();
    }

    public function porPeriodo(int $idPeriodo): Collection
    {
        return $this->query()
            ->where('id_periodo', $idPeriodo)
            ->orderBy('data_emissao')
            ->get();
    }

    public function porDirecao(string $direcao): Collection
    {
        return $this->query()
            ->where('direcao', $direcao)
            ->orderByDesc('data_emissao')
            ->get();
    }

    public function porStatus(string $status): Collection
    {
        return $this->query()
            ->where('status_importacao', $status)
            ->orderByDesc('data_emissao')
            ->get();
    }

    public function comErro(): Collection
    {
        return $this->query()
            ->where('status_importacao', 'Importado com erro')
            ->orderByDesc('data_emissao')
            ->get();
    }

    public function porId(int $id): NotaFiscal
    {
        return $this->query()->findOrFail($id);
    }

    public function porIdComItensEImpostos(int $id): NotaFiscal
    {
        return $this->query()
            ->with(['itens.impostos', 'itens.produtoServico', 'emitente', 'destinatario'])
            ->findOrFail($id);
    }

    /**
     * Cria NotaFiscal + itens + impostos em transação.
     * Espera $data já com id_filial/id_periodo/direcao/origem/status_importacao.
     */
    public function criarComItens(array $data): NotaFiscal
    {
        $itens = $data['itens'] ?? [];
        unset($data['itens']);

        return DB::transaction(function () use ($data, $itens) {
            /** @var NotaFiscal $nota */
            $nota = $this->create($data);

            foreach ($itens as $item) {
                $impostos = $item['impostos'] ?? [];
                unset($item['impostos']);
                $item['id_nota_fiscal'] = $nota->id;

                $itemModel = $nota->itens()->create($item);

                foreach ($impostos as $imposto) {
                    $itemModel->impostos()->create($imposto);
                }
            }

            return $nota->load('itens.impostos');
        });
    }

    public function atualizarComItens(int $id, array $data): NotaFiscal
    {
        $itens = $data['itens'] ?? [];
        unset($data['itens']);

        return DB::transaction(function () use ($id, $data, $itens) {
            /** @var NotaFiscal $nota */
            $nota = $this->query()->findOrFail($id);
            $nota->update($data);

            $nota->itens()->delete();

            foreach ($itens as $item) {
                $impostos = $item['impostos'] ?? [];
                unset($item['impostos']);
                $item['id_nota_fiscal'] = $nota->id;

                $itemModel = $nota->itens()->create($item);

                foreach ($impostos as $imposto) {
                    $itemModel->impostos()->create($imposto);
                }
            }

            return $nota->fresh(['itens.impostos']);
        });
    }
}
