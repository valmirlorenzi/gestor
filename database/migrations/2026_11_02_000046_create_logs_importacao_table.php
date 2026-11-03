<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('logs_importacao', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_filial');
            $table->string('tipo_documento', 20);
            $table->string('caminho_arquivo', 500)->nullable();
            $table->string('status', 30);
            $table->text('mensagem')->nullable();

            $table->timestamp('created_at')->nullable();

            $table->foreign('id_filial', 'fk_logs_importacao_filial')
                ->references('id')->on('filiais')->cascadeOnUpdate();

            $table->index('id_filial', 'idx_logs_importacao_filial');
            $table->index('status', 'idx_logs_importacao_status');
            $table->index('created_at', 'idx_logs_importacao_created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logs_importacao');
    }
};
