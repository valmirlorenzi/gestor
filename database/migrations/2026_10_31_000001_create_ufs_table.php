<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ufs', function (Blueprint $table) {
            $table->id();
            $table->char('sigla', 2)->unique();
            $table->string('nome', 100);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ufs');
    }
};