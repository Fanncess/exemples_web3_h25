using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using System.Reflection;

namespace messagerie_api.OpenApi;

/// <summary>
/// Transforms the OpenAPI schema to include examples from the <see cref="ExampleAttribute"/>.
/// </summary>
public sealed class ExampleSchemaTransformer : IOpenApiSchemaTransformer
{
    public Task TransformAsync(OpenApiSchema schema, OpenApiSchemaTransformerContext context, CancellationToken cancellationToken)
    {
        AddExampleToProblemDetails(schema);

        PropertyInfo[] properties = context.JsonTypeInfo.Type.GetProperties();
        foreach (var property in properties)
        {
            foreach (var attr in property.GetCustomAttributes())
            {
                if (attr is ExampleAttribute a)
                {
                    foreach (var schemaProperty in schema.Properties)
                    {
                        if (schemaProperty.Key.ToLower() == property.Name.ToLower())
                        {
                            schemaProperty.Value.Example = new OpenApiString(a.Example);
                        }
                    }
                }
            }
        }

        return Task.CompletedTask;
    }

    private void AddExampleToProblemDetails(OpenApiSchema schema)
    {
        if (schema.Annotations is null)
        {
            return;
        }
        if (schema.Annotations["x-schema-id"] is null)
        {
            return;
        }
        if ((string)schema.Annotations["x-schema-id"] != "ProblemDetails")
        {
            return;
        }

        schema.Properties["type"].Example = new OpenApiString("https://tools.ietf.org/html/rfc7231#section-6.5.1");
        schema.Properties["title"].Example = new OpenApiString("Bad Request");
        schema.Properties["status"].Example = new OpenApiInteger(StatusCodes.Status400BadRequest);
        schema.Properties["detail"].Example = new OpenApiString("The specified value is invalid.");
    }
}
