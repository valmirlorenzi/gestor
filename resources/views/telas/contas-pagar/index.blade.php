@extends('layouts.app')

@section('title', 'Contas a Pagar')

@section('content')
    <div id="contas-pagar-app">
        <div class="contas-header">
            <h1>Contas a Pagar</h1>
        </div>
        <p class="subtitle">Gerencie pagamentos, baixas e juros/multa</p>

        <div class="contas-kpis" id="contas-pagar-kpis"></div>

        <div class="contas-filtros">
            <select id="filtro-status">
                <option value="todas">Todas</option>
                <option value="abertas">Abertas</option>
                <option value="vencidas">Vencidas</option>
                <option value="baixadas">Baixadas</option>
            </select>
            <input type="text" id="filtro-fornecedor" placeholder="Buscar fornecedor...">
            <select id="filtro-periodo">
                <option value="todos">Todo o período</option>
                <option value="30dias">Próximos 30 dias</option>
                <option value="60dias">Próximos 60 dias</option>
                <option value="vencidas">Só vencidas</option>
            </select>
        </div>

        <div class="card">
            <table class="data data-contas" id="tabela-contas-pagar">
                <thead>
                    <tr>
                        <th>Fornecedor</th>
                        <th>Documento</th>
                        <th>Parcela</th>
                        <th>Vencimento</th>
                        <th style="text-align:right;">Valor</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <p class="muted" id="contas-pagar-vazio" style="display:none;">Nenhuma conta encontrada.</p>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('assets/js/contas-pagar-list.js') }}"></script>
@endpush