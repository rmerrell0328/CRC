namespace CRC.Models
{
    public class CableType
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string Text { get; set; }
        public double High { get; set; }
        public double Mid { get; set; }
        public double Low { get; set; }
        public double XmitHigh { get; set; }
        public double XmitLow { get; set; }
        public double Length { get; set; }
    }
}