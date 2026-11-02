<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notas_fiscais', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_filial')->constrained('filiais')->cascadeOnUpdate();
            $table->foreignId('id_tipo_documento')->constrained('tipos_documento')->cascadeOnUpdate();
            $table->string('origem', 10);
            $table->string('direcao', 10);
            $table->char('chave', 44)->nullable();
            $table->string('numero', 20)->nullable();
            $table->string('serie', 10)->nullable();
            $table->date('data_emissao');
            $table->foreignId('id_pessoa_emitente')->nullable()->constrained('pessoas')->cascadeOnUpdate();
            $table->foreignId('id_pessoa_destinatario')->nullable()->constrained('pessoas')->cascadeOnUpdate();
            $table->foreignId('id_municipio_emissao')->nullable()->constrained('municipios')->cascadeOnUpdate();
            $table->decimal('valor_produtos', 15, 2)->default(0);
            $table->decimal('valor_desconto', 15, 2)->default(0);
            $table->decimal('valor_frete', 15, 2)->default(0);
            $table->decimal('valor_total', 15, 2)->default(0);
            $table->longText('xml_origem')->nullable();
            $table->string('status_importacao', 30);
            $table->string('status_fluxo', 30)->nullable();
            $table->string('motivo_cancelamento', 200)->nullable();
            $table->foreignId('id_periodo')->constrained('periodos')->cascadeOnUpdate();
            $table->json('dados_extras')->nullable();

            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->unique('chave');
            $table->index('id_filial');
            $table->index('id_tipo_documento');
            $table->index('id_periodo');
            $table->index('id_pessoa_emitente');
            $table->index('id_pessoa_destinatario');
            $table->index('data_emissao');
            $table->index('status_importacao');
            $table->index('status_fluxo');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notas_fiscais');
    }
};