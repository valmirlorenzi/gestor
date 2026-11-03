<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documentos_encadeados', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_documento_origem');
            $table->unsignedBigInteger('id_documento_destino');
            $table->string('tipo_relacao', 30);
            $table->json('dados_extras')->nullable();

            $table->timestamp('created_at')->nullable();

            // Sem FK: referências polimórficas por (id_documento_*, tipo_relacao).
            // Coerência validada no repositório (Bloco 6.18, P48).

            $table->index('id_documento_origem', 'idx_docs_encad_origem');
            $table->index('id_documento_destino', 'idx_docs_encad_destino');
            $table->index('tipo_relacao', 'idx_docs_encad_tipo_relacao');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documentos_encadeados');
    }
};
