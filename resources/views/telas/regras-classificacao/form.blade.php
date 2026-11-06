@extends('layouts.app')

@section('title', isset($model) ? 'Editar regra' : 'Nova regra')

@section('content')
<div id="regra-form-app" data-id="{{ $model->id ?? '' }}">
  <h1>{{ isset($model) ? 'Editar regra' : 'Cadastrar regra' }}</h1>

  <div class="card">
    <h2>Dados da regra</h2>
    <div class="form-grid">
      <div class="form-row">
        <label>Descrição *</label>
        <input type="text" id="regra-descricao" maxlength="200"
               value="{{ $model->descricao ?? '' }}">
      </div>
      <div class="form-row">
        <label>Prioridade * (1 = mais específica)</label>
        <select id="regra-prioridade">
          @foreach (range(1, 8) as $p)
            <option value="{{ $p }}" {{ (isset($model) && $model->prioridade === $p) ? 'selected' : '' }}>{{ $p }}</option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Tipo de documento</label>
        <select id="regra-tipo-documento">
          <option value="">—</option>
          @foreach ($tiposDocumento as $t)
            <option value="{{ $t->id }}" {{ (isset($model) && $model->id_tipo_documento === $t->id) ? 'selected' : '' }}>
              {{ $t->codigo }} — {{ $t->descricao }}
            </option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>CFOP</label>
        <select id="regra-cfop">
          <option value="">—</option>
          @foreach ($cfops as $c)
            <option value="{{ $c->id }}" {{ (isset($model) && $model->id_cfop === $c->id) ? 'selected' : '' }}>
              {{ $c->codigo }} — {{ $c->descricao }}
            </option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>CST</label>
        <select id="regra-cst">
          <option value="">—</option>
          @foreach ($csts as $c)
            <option value="{{ $c->id }}" {{ (isset($model) && $model->id_cst === $c->id) ? 'selected' : '' }}>
              {{ $c->tipo_imposto }} · {{ $c->codigo }} — {{ $c->descricao }}
            </option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Serviço LC116</label>
        <select id="regra-servico-lc116">
          <option value="">—</option>
          @foreach ($servicosLc116 as $s)
            <option value="{{ $s->id }}" {{ (isset($model) && $model->id_servico_lc116 === $s->id) ? 'selected' : '' }}>
              {{ $s->codigo }} — {{ $s->descricao }}
            </option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Fornecedor</label>
        <select id="regra-fornecedor">
          <option value="">—</option>
          @foreach ($fornecedores as $f)
            <option value="{{ $f->id }}" {{ (isset($model) && $model->id_pessoa_fornecedor === $f->id) ? 'selected' : '' }}>
              {{ $f->nome }} ({{ $f->documento }})
            </option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Categoria do fornecedor</label>
        <input type="text" id="regra-categoria-fornecedor" maxlength="50"
               value="{{ $model->categoria_fornecedor ?? '' }}">
      </div>
      <div class="form-row">
        <label>Palavra-chave no histórico</label>
        <input type="text" id="regra-palavra-chave" maxlength="100"
               value="{{ $model->historico_palavra_chave ?? '' }}">
      </div>
      <div class="form-row">
        <label>Conta destino *</label>
        <select id="regra-conta-destino">
          <option value="">—</option>
          @foreach ($planosConta as $p)
            <option value="{{ $p->id }}" {{ (isset($model) && $model->id_conta_destino === $p->id) ? 'selected' : '' }}>
              {{ $p->codigo }} — {{ $p->descricao }}
            </option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Centro de custo padrão</label>
        <select id="regra-centro-custo">
          <option value="">—</option>
          @foreach ($centrosCusto as $c)
            <option value="{{ $c->id }}" {{ (isset($model) && $model->id_centro_custo_padrao === $c->id) ? 'selected' : '' }}>
              {{ $c->nome }}
            </option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Conta contrapartida padrão</label>
        <select id="regra-conta-contrapartida">
          <option value="">—</option>
          @foreach ($planosConta as $p)
            <option value="{{ $p->id }}" {{ (isset($model) && $model->id_conta_contrapartida_padrao === $p->id) ? 'selected' : '' }}>
              {{ $p->codigo }} — {{ $p->descricao }}
            </option>
          @endforeach
        </select>
      </div>
      <div class="form-row">
        <label>Ativo</label>
        <select id="regra-ativo">
          <option value="1" {{ (! isset($model) || $model->ativo) ? 'selected' : '' }}>Sim</option>
          <option value="0" {{ (isset($model) && !$model->ativo) ? 'selected' : '' }}>Não</option>
        </select>
      </div>
    </div>
  </div>

  <div class="form-actions">
    <a href="{{ route('regras-classificacao.index') }}" class="btn btn-secondary">Cancelar</a>
    <button class="btn btn-primary" id="regra-salvar">Salvar</button>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/js/regras-classificacao-form.js') }}"></script>
@endpush