"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUploadExcel } from "@/hooks/use-api";
import { Upload, FileSpreadsheet, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadExcel();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    uploadMutation.mutate(
      { file: selectedFile, retrain: true },
      {
        onSuccess: () => {
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Subir Datos de Ventas</h1>
        <p className="text-muted-foreground mt-1">
          Importa archivos Excel para actualizar el dataset y reentrenar modelos
        </p>
      </div>

      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Cargar Archivo Excel</CardTitle>
          <CardDescription>
            Sube un archivo .xlsx o .xls con datos de ventas del Petshop
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              selectedFile
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                {selectedFile ? (
                  <>
                    <FileSpreadsheet className="h-12 w-12 text-primary" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      Cambiar archivo
                    </Button>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Click para seleccionar archivo</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Formatos soportados: .xlsx, .xls
                      </p>
                    </div>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Upload Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Subir y Procesar
              </>
            )}
          </Button>

          {/* Progress/Result */}
          {uploadMutation.isPending && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <div>
                  <p className="font-medium text-blue-900">Procesando archivo...</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Esto puede tomar unos momentos. El modelo se reentrenará en background.
                  </p>
                </div>
              </div>
            </div>
          )}

          {uploadMutation.isSuccess && uploadMutation.data && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="font-medium text-green-900">¡Archivo procesado exitosamente!</p>
                    <p className="text-sm text-green-700 mt-1">
                      {uploadMutation.data.message}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-green-700 font-medium">Registros Procesados</p>
                      <p className="text-lg font-bold text-green-900">
                        {formatNumber(uploadMutation.data.records_processed, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 font-medium">Registros Añadidos</p>
                      <p className="text-lg font-bold text-green-900">
                        {formatNumber(uploadMutation.data.records_added, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 font-medium">Duplicados Eliminados</p>
                      <p className="text-lg font-bold text-green-900">
                        {formatNumber(uploadMutation.data.duplicates_removed, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 font-medium">Total Registros</p>
                      <p className="text-lg font-bold text-green-900">
                        {formatNumber(uploadMutation.data.total_records, 0)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-green-700 font-medium mb-2">Período de Datos</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{uploadMutation.data.data_period.start}</Badge>
                      <span className="text-green-700">→</span>
                      <Badge variant="outline">{uploadMutation.data.data_period.end}</Badge>
                      <span className="text-xs text-green-700">
                        ({uploadMutation.data.data_period.unique_days} días únicos)
                      </span>
                    </div>
                  </div>

                  {uploadMutation.data.model_retrained && (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Modelo reentrenándose en background
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {uploadMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Error al procesar archivo</p>
                  <p className="text-sm text-red-700 mt-1">
                    {uploadMutation.error?.message || "Ocurrió un error inesperado"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Formato del Archivo</CardTitle>
          <CardDescription>Requisitos y estructura esperada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium mb-2">Columnas requeridas:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Fechas con día de la semana (ej: "LUNES 01/01/2026")</li>
                <li>Producto (categoría)</li>
                <li>Detalle (nombre específico del producto)</li>
                <li>Kilos</li>
                <li>Contado, Tarjeta_Laura, Tarjeta_Jorge (métodos de pago)</li>
                <li>Totales diarios (Sub Total, Total Ventas Bruto)</li>
              </ul>
            </div>

            <div>
              <p className="font-medium mb-2">Proceso automático:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Procesamiento y limpieza de datos del Excel</li>
                <li>Combinación con dataset existente</li>
                <li>Eliminación automática de duplicados</li>
                <li>Actualización del dataset consolidado</li>
                <li>Reentrenamiento del modelo ML en background</li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-900">
                💡 Tip: El reentrenamiento se ejecuta en background si hay menos de 500 registros nuevos.
                Para datasets grandes, el proceso es síncrono y puede tomar más tiempo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
