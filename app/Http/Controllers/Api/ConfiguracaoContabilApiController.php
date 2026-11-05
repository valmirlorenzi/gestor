<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\GrupoA\PlanoContaRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConfiguracaoContabilApiController extends Controller
{
    public function __construct(private PlanoContaRepository $planos) {}

    public function index(): JsonResponse
    {
        $contas = $this->planos->analiticasComMapeamento();

        // Deriva "status" (ok/pendente) a partir de conta_referencial.
        $data = $contas->map(fn ($c) => [
            'id' => $c->id,
            'codigo' => $c->codigo,
            'descricao' => $c->descricao,
            'conta_referencial' => $c->conta_referencial,
            'status' => $c->conta_referencial !== null ? 'ok' : 'pendente',
        ]);

        return response()->json($data);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $plano = $this->planos->porId($id);

        $data = $request->validate([
            'conta_referencial' => ['nullable', 'string', 'max:20'],
        ]);

        $plano->update(['conta_referencial' => $data['conta_referencial'] ?? null]);

        return response()->json($plano->fresh());
    }
}
