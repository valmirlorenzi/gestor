@extends('layouts.app')

@section('title', 'Preparar Fechamento')

@section('content')
<div id="preparar-fechamento-app">
  <div class="page-header" style="margin-bottom:16px;">
    <h1>Preparar Fechamento</h1>
  </div>

  <div class="card">
    <h2>Checklist do período</h2>
    <ul id="checklist" style="list-style:none; padding:0;"></ul>
  </div>

  <div class="form-actions">
    <button class="btn btn-primary" id="enviar-auditor">Enviar para o Auditor</button>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/preparar-fechamento.js') }}"></script>
@endpush