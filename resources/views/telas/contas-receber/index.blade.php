@extends('layouts.app')

@section('title', 'Contas a Receber')

@section('content')
    <div id="contas-receber-app">
        <div class="contas-header">
            <h1>Contas a Receber</h1>
        </div>
        <p class="subtitle">Gerencie recebimentos, baixas e inadimplência</p>

        <div class="contas-kpis" id="contas-receber-kpis"></div>

        <div class="contas-filtros">
            <select id="filtro-status">
                <option value="todas">Todas</option>
                <option value="abertas">Abertas</option>
                <option value="vencidas">Inadimplentes</option>
                <option value="baixadas">Recebidas</option>
            </select>
            <input type="text" id="filtro-cliente" placeholder="Buscar cliente...">
            <select id="filtro-periodo">
                <option value="todos">Todo o período</option>
                <option value="30dias">Próximos 30 dias</option>
                <option value="60dias">Próximos 60 dias</option>
                <option value="vencidas">Só inadimplentes</option>
            </select>
        </div>

        <div class="card">
            <table class="data data-contas" id="tabela-contas-receber">
                <thead>
                    <tr>
                        <th>Cliente</th>
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
            <p class="muted" id="contas-receber-vazio" style="display:none;">Nenhuma conta encontrada.</p>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('assets/js/contas-receber-list.js') }}"></script>
@endpush