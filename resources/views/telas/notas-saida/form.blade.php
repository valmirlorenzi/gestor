@extends('layouts.app')

@section('title', isset($model) ? 'Editar nota de saída' : 'Nova nota de saída')

@section('content')
    <div id="notas-saida-form-app"
         data-id="{{ $model->id ?? '' }}"
         data-periodo-aberto="{{ $periodoAberto ?? '' }}"
         data-tipos='@json($tiposDocumento)'
         data-clientes='@json($clientes)'>
        <h1>{{ isset($model) ? 'Editar nota de saída' : 'Nova nota de saída' }}</h1>

        <div id="wizard"></div>

        <div class="form-actions">
            <a href="{{ route('faturista.nota-saida.index') }}" class="btn btn-secondary">Cancelar</a>
            <button type="button" class="btn btn-secondary" id="btn-rascunho">Salvar rascunho</button>
            <button type="button" class="btn btn-primary" id="btn-confirmar">Confirmar e gerar</button>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('assets/js/notas-saida-form.js') }}"></script>
@endpush