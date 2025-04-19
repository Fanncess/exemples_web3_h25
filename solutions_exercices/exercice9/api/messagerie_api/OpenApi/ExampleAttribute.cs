namespace messagerie_api.OpenApi;

/// <summary>
/// Specifies an example value for a property.
/// </summary>
[AttributeUsage(AttributeTargets.Property)]
public class ExampleAttribute : Attribute
{
    /// <summary>
    /// Read/Write property that directly modifies the value stored in the example
    /// attribute. The default implementation of the <see cref="Example"/> property
    /// simply returns this value.
    /// </summary>
    protected string ExampleValue { get; set; }

    /// <summary>
    /// Initializes a new instance of the <see cref='OpenApi.ExampleAttribute{T}'/> class.
    /// </summary>
    public ExampleAttribute(string example)
    {
        ExampleValue = example;
    }

    /// <summary>
    /// Gets the example stored in this attribute.
    /// </summary>
    public virtual string Example => ExampleValue;
}