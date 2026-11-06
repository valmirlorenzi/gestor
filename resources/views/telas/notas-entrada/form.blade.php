@extends('layouts.app')

@section('title', isset($model) ? 'Editar nota de entrada' : 'Nova nota de entrada')

@section('content')
    <div id="notas-entrada-form-app"
         data-id="{{ $model->id ?? '' }}"
         data-periodo-aberto="{{ $periodoAberto ?? '' }}"
         data-tipos='@json($tiposDocumento)'
         data-fornecedores='@json($fornecedores)'>
        <h1>{{ isset($model) ? 'Editar nota de entrada' : 'Nova nota de entrada' }}</h1>

        <div id="wizard"></div>

        <div class="form-actions">
            <a href="{{ route('comprador.nota-entrada.index') }}" class="btn btn-secondary">Cancelar</a>
            <button type="button" class="btn btn-secondary" id="btn-rascunho">Salvar rascunho</button>
            <button type="button" class="btn btn-primary" id="btn-confirmar">Confirmar e gerar</button>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('assets/js/notas-entrada-form.js') }}"></script>
@endpush