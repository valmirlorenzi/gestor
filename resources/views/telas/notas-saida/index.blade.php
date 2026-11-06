@extends('layouts.app')

@section('title', 'Notas de Saída')

@section('content')
    <div id="notas-saida-list-app">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h1>Notas de Saída</h1>
            <a href="{{ route('faturista.nota-saida.create') }}" class="btn btn-primary">Nova nota de saída</a>
        </div>

        <div class="card">
            <h2>Lista</h2>
            <table class="data" id="tabela-notas-saida">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Cliente</th>
                        <th>Nº / Série</th>
                        <th>Data</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th style="width:180px;">Ações</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <p class="muted" id="notas-saida-vazio" style="display:none;">Nenhuma nota de saída cadastrada.</p>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('assets/js/notas-saida-list.js') }}"></script>
@endpush