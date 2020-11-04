namespace CRC.Models
{
    using System.ComponentModel.DataAnnotations;

    public class Output
    {
        [Key]
        public int Id { get; set; }
        public string Type { get; set; }
        public string Text { get; set; }
        public double High { get; set; }
        public double Mid { get; set; }
        public double Low { get; set; }
        public double XmitHigh { get; set; }
        public double XmitLow { get; set; }
    }
}