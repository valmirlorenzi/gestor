<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Importacoes\RelatorioCarga;
use App\Services\ImportacaoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ImportacaoApiController extends Controller
{
    public function __construct(private ImportacaoService $service) {}

    public function preValidar(Request $request): JsonResponse
    {
        $data = $request->validate([
            'recurso' => 'required|string',
            'modo' => 'nullable|in:inserir,atualizar,upsert',
            'conteudo' => 'required|string',
        ]);

        $motor = $this->motor($data['recurso']);

        $rel = $motor === 'documento'
            ? $this->service->preValidarDocumento($data['recurso'], $data['conteudo'])
            : $this->service->preValidar($data['recurso'], $data['conteudo'], $data['modo'] ?? 'inserir');

        return response()->json($this->serializar($rel));
    }

    public function confirmar(Request $request): JsonResponse
    {
        $data = $request->validate([
            'recurso' => 'required|string',
            'modo' => 'nullable|in:inserir,atualizar,upsert',
            'conteudo' => 'required|string',
        ]);

        $motor = $this->motor($data['recurso']);

        $rel = $motor === 'documento'
            ? $this->service->confirmarDocumento($data['recurso'], $data['conteudo'])
            : $this->service->confirmar($data['recurso'], $data['conteudo'], $data['modo'] ?? 'inserir');

        return response()->json($this->serializar($rel));
    }

    public function template(string $chave): BinaryFileResponse
    {
        try {
            $path = $this->service->template($chave);
        } catch (\Throwable) {
            abort(404, 'Template não encontrado.');
        }

        return response()->download($path, basename($path), [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    private function motor(string $recurso): string
    {
        $todos = config('importacoes', []);
        if (! isset($todos[$recurso])) {
            abort(422, "Recurso não configurado: {$recurso}");
        }

        return $todos[$recurso]['motor'] ?? 'cadastro';
    }

    /** @return array<string, mixed> */
    private function serializar(RelatorioCarga $rel): array
    {
        return [
            'recurso' => $rel->recurso,
            'modo' => $rel->modo,
            'total' => $rel->total(),
            'aceitas' => $rel->aceitas(),
            'avisos' => $rel->avisos(),
            'rejeitadas' => $rel->rejeitadas(),
            'ids_criados' => $rel->idsCriados(),
            'erro_arquivo' => $rel->erroArquivo,
            'linhas' => array_map(fn ($l) => $l->toArray(), $rel->linhas),
        ];
    }
}
