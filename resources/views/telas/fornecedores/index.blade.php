@extends('layouts.app')

@section('title', 'Fornecedores')

@section('content')
    <div id="fornecedores-list-app">
        <div class="page-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h1>Fornecedores</h1>
            <a href="{{ route('comprador.fornecedores.create') }}" class="btn btn-primary">Novo fornecedor</a>
        </div>

        <div class="card">
            <h2>Lista</h2>
            <table class="data" id="tabela-fornecedores">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Documento</th>
                        <th>Tipo</th>
                        <th>Categoria</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Status</th>
                        <th style="width:180px;">Ações</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <p class="muted" id="fornecedores-vazio" style="display:none;">Nenhum fornecedor cadastrado.</p>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('assets/js/fornecedores-list.js') }}"></script>
@endpush