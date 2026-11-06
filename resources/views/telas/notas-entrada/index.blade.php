@extends('layouts.app')

@section('title', 'Notas de Entrada')

@section('content')
    <div id="notas-entrada-list-app">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h1>Notas de Entrada</h1>
            <a href="{{ route('comprador.nota-entrada.create') }}" class="btn btn-primary">Nova nota de entrada</a>
        </div>

        <div class="card">
            <h2>Lista</h2>
            <table class="data" id="tabela-notas-entrada">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Fornecedor</th>
                        <th>Nº / Série</th>
                        <th>Data</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th style="width:180px;">Ações</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <p class="muted" id="notas-entrada-vazio" style="display:none;">Nenhuma nota de entrada cadastrada.</p>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('assets/js/notas-entrada-list.js') }}"></script>
@endpush