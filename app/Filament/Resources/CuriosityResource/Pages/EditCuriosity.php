<?php

namespace App\Filament\Resources\CuriosityResource\Pages;

use App\Filament\Resources\CuriosityResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCuriosity extends EditRecord
{
    protected static string $resource = CuriosityResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
