import { useFieldArray, UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, GripVertical, ChevronDown, Plus, X } from "lucide-react";
import { SchemaBuilderForm, SchemaField, FieldType } from "@shared/schema";
import { cn } from "@/lib/utils";

interface FieldRowProps {
  field: SchemaField;
  index: number;
  form: UseFormReturn<SchemaBuilderForm>;
  onRemove: () => void;
  isNested?: boolean;
  nestingLevel?: number;
}

export default function FieldRow({ field, index, form, onRemove, isNested = false, nestingLevel = 0 }: FieldRowProps) {
  const { fields: nestedFields, append: appendNested, remove: removeNested } = useFieldArray({
    control: form.control,
    name: `fields.${index}.nested`
  });

  const addNestedField = () => {
    const newField: SchemaField = {
      id: `nested_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      type: "String",
      defaultValue: "",
      nested: []
    };
    appendNested(newField);
  };

  const removeNestedField = (nestedIndex: number) => {
    removeNested(nestedIndex);
  };

  const fieldType = form.watch(`fields.${index}.type`);
  const isNestedType = fieldType === "Nested";
  
  // Get appropriate color and icon for field type
  const getFieldTypeColor = (type: string) => {
    switch (type) {
      case "String": return "bg-blue-500";
      case "Number": return "bg-green-500";
      case "Float": return "bg-teal-500";
      case "Boolean": return "bg-purple-500";
      case "ObjectId": return "bg-orange-500";
      case "Nested": return "bg-yellow-500";
      default: return "bg-primary";
    }
  };

  return (
    <Card className={cn("field-row", isNested && "bg-muted/50")}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={cn(
            "w-1 h-8 rounded flex-shrink-0",
            getFieldTypeColor(fieldType)
          )} />
          
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name={`fields.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      Field Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter field name"
                        {...field}
                        className="transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`fields.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="String">String</SelectItem>
                        <SelectItem value="Number">Number</SelectItem>
                        <SelectItem value="Float">Float</SelectItem>
                        <SelectItem value="Boolean">Boolean</SelectItem>
                        <SelectItem value="ObjectId">ObjectId</SelectItem>
                        <SelectItem value="Nested">Nested</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`fields.${index}.defaultValue`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground">
                      {isNestedType ? "Actions" : "Default Value"}
                    </FormLabel>
                    <FormControl>
                      {isNestedType ? (
                        <Button
                          type="button"
                          onClick={addNestedField}
                          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Nested Field
                        </Button>
                      ) : fieldType === "Boolean" ? (
                        <select
                          {...field}
                          value={field.value || ""}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select default</option>
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      ) : (
                        <Input
                          type={fieldType === "Number" || fieldType === "Float" ? "number" : "text"}
                          step={fieldType === "Float" ? "0.01" : undefined}
                          placeholder={
                            fieldType === "ObjectId" ? "507f1f77bcf86cd799439011" :
                            fieldType === "Float" ? "0.00" :
                            fieldType === "Number" ? "0" :
                            "Default value"
                          }
                          {...field}
                          value={field.value || ""}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Nested Fields */}
            {isNestedType && nestedFields && nestedFields.length > 0 && (
              <div className="nested-container space-y-2">
                {nestedFields.map((nestedField, nestedIndex) => (
                  <Card key={nestedField.id} className="bg-muted/30">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-1 h-6 rounded flex-shrink-0",
                          getFieldTypeColor(form.watch(`fields.${index}.nested.${nestedIndex}.type`) || "String")
                        )} />
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <FormField
                            control={form.control}
                            name={`fields.${index}.nested.${nestedIndex}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Enter field name"
                                    {...field}
                                    className="text-sm"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`fields.${index}.nested.${nestedIndex}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="text-sm">
                                      <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="String">String</SelectItem>
                                    <SelectItem value="Number">Number</SelectItem>
                                    <SelectItem value="Float">Float</SelectItem>
                                    <SelectItem value="Boolean">Boolean</SelectItem>
                                    <SelectItem value="ObjectId">ObjectId</SelectItem>
                                    <SelectItem value="Nested">Nested</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`fields.${index}.nested.${nestedIndex}.defaultValue`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  {(() => {
                                    const nestedFieldType = form.watch(`fields.${index}.nested.${nestedIndex}.type`);
                                    if (nestedFieldType === "Boolean") {
                                      return (
                                        <select
                                          {...field}
                                          value={field.value || ""}
                                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                          <option value="">Select default</option>
                                          <option value="true">True</option>
                                          <option value="false">False</option>
                                        </select>
                                      );
                                    }
                                    return (
                                      <Input
                                        type={nestedFieldType === "Number" || nestedFieldType === "Float" ? "number" : "text"}
                                        step={nestedFieldType === "Float" ? "0.01" : undefined}
                                        placeholder={
                                          nestedFieldType === "ObjectId" ? "507f1f77bcf86cd799439011" :
                                          nestedFieldType === "Float" ? "0.00" :
                                          nestedFieldType === "Number" ? "0" :
                                          "Default value"
                                        }
                                        {...field}
                                        value={field.value || ""}
                                        className="text-sm"
                                      />
                                    );
                                  })()}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNestedField(nestedIndex)}
                          className="text-muted-foreground hover:text-destructive p-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {isNestedType && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground p-1"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground p-1"
            >
              <GripVertical className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-muted-foreground hover:text-destructive p-1"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
