<?php

use App\Http\Controllers\Api\NotaFiscalSaidaApiController;
use App\Importacoes\Parsers\NfeParser;
use App\Importacoes\Parsers\NfseParser;
use App\Importacoes\ValidadorDocumento;
use App\Models\CentroCusto;
use App\Models\NotaFiscal;
use App\Repositories\GrupoA\CentroCustoRepository;
use App\Repositories\GrupoF\NotaFiscalRepository;

return [

    /*
    |--------------------------------------------------------------------------
    | Mapa de recursos do módulo Importações (12.6)
    |--------------------------------------------------------------------------
    |
    | Fonte da verdade do motor A (cadastro). Cada recurso declara:
    |   rotulo                — nome exibido na UI (10b-3)
    |   atores               — códigos de ator_funcional autorizados (T9.10)
    |   motor                 — 'cadastro' (A) | 'documento' (B) | 'legado' (C, dentro do A)
    |   model                 — classe Eloquent alvo
    |   repository            — repositório concreto (deve estender BaseRepository)
    |   chave_natural         — array de colunas que identificam unicamente (modo atualizar/upsert)
    |   colunas_obrigatorias  — colunas que o cabeçalho do CSV precisa ter (senão rejeita arquivo)
    |   colunas_opcionais     — colunas aceitas a mais (extras geram aviso, não rejeitam)
    |   modos                 — modos permitidos ('inserir' default; 'atualizar'; 'upsert')
    |   template              — caminho relativo a resources/ (10b-3 serve para download)
    |   casts                 — cast por coluna ('bool'|'int'|'decimal'|'date'|'string')
    |   tenant                — 'empresa' (id_empresa) | 'filial' (id_filial)
    |
    | Hardcoded na fase 1 (T9.10). Configurável sem deploy é fase 2 (P162).
    |
    */

    'centros_custo' => [
        'rotulo' => 'Centros de Custo',
        'atores' => ['configurador', 'contador'],
        'motor' => 'cadastro',
        'model' => CentroCusto::class,
        'repository' => CentroCustoRepository::class,
        'chave_natural' => ['nome'],
        'colunas_obrigatorias' => ['nome'],
        'colunas_opcionais' => ['responsavel', 'ativo'],
        'modos' => ['inserir', 'atualizar', 'upsert'],
        'template' => 'importacoes/templates/centros_custo.csv',
        'casts' => ['ativo' => 'bool'],
        'tenant' => 'empresa',
    ],

    // --- Motor B (documento) ---

    'nfe_entrada' => [
        'rotulo' => 'NF-e (entrada)',
        'atores' => ['configurador', 'comprador'],
        'motor' => 'documento',
        'formato' => 'xml',
        'tipo_documento' => 'NF-e',
        'direcao' => 'Entrada',
        'model' => NotaFiscal::class,
        'repository' => NotaFiscalRepository::class,
        'parser' => NfeParser::class,
        'validador' => ValidadorDocumento::class,
        'ordem' => 'O1',
        'tenant' => 'filial',
    ],

    'nfe_saida' => [
        'rotulo' => 'NF-e (saída)',
        'atores' => ['configurador', 'faturista'],
        'motor' => 'documento',
        'formato' => 'xml',
        'tipo_documento' => 'NF-e',
        'direcao' => 'Saida',
        'controller' => NotaFiscalSaidaApiController::class,
        'model' => NotaFiscal::class,
        'repository' => NotaFiscalRepository::class,
        'parser' => NfeParser::class,
        'validador' => ValidadorDocumento::class,
        'ordem' => 'O2',
        'tenant' => 'filial',
    ],

    'nfse_tomada' => [
        'rotulo' => 'NFS-e (tomada)',
        'atores' => ['configurador', 'comprador'],
        'motor' => 'documento',
        'formato' => 'xml',
        'tipo_documento' => 'NFS-e',
        'direcao' => 'Entrada',
        'model' => NotaFiscal::class,
        'repository' => NotaFiscalRepository::class,
        'parser' => NfseParser::class,
        'validador' => ValidadorDocumento::class,
        'ordem' => 'O3',
        'tenant' => 'filial',
    ],

    'nfse_prestada' => [
        'rotulo' => 'NFS-e (prestada)',
        'atores' => ['configurador', 'faturista'],
        'motor' => 'documento',
        'formato' => 'xml',
        'tipo_documento' => 'NFS-e',
        'direcao' => 'Saida',
        'controller' => NotaFiscalSaidaApiController::class,
        'model' => NotaFiscal::class,
        'repository' => NotaFiscalRepository::class,
        'parser' => NfseParser::class,
        'validador' => ValidadorDocumento::class,
        'ordem' => 'O4',
        'tenant' => 'filial',
    ],

    // 10b-4..10b-8 preenchem os 4 restantes:
    // 'cte_tomado'    => [...],  // 10b-6
    // 'cte_emitido'   => [...],  // 10b-6
    // 'rpa'           => [...],  // 10b-7 (CSV)
    // 'folha'         => [...],  // 10b-8 (CSV)

    // 10b-9 preenche os outros 12 recursos do motor A aqui:
    //
    // 'condicoes_pagamento' => [...],
    // 'formas_pagamento'    => [...],
    // 'tipos_cliente'       => [...],
    // 'tipos_fornecedor'    => [...],
    // 'proventos_descontos' => [...],
    // 'contas_bancarias'    => [...],  // FK por codigo_banco (10b-9)
    // 'filiais'             => [...],  // NÃO cria período (decisão 10.4)
    // 'ativos'              => [...],  // FK por cnpj_filial (10b-9)
    // 'pessoas'             => [...],  // composto: pessoa + PF/PJ + tag
    // 'funcionarios'        => [...],  // composto: pessoa PF + tag + funcionario
    // 'produtos'            => [...],  // composto: produto_servico + produto
    // 'servicos'            => [...],  // composto: produto_servico + servico
];
