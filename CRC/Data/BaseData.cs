namespace CRC.Data
{
    using CRC.Models;
    using System.Collections.Generic;

    public class BaseData
    {
        public static readonly IEnumerable<Output> Default = new[]
        {
            new Output
            {
                Id = 0,
                Text = "Tap / Source",
                Type = "Tap",
                High = 43,
                Mid = 40,
                Low = 33,
                XmitHigh = 21,
                XmitLow = 18
            }
        };

        public static readonly IEnumerable<CableType> CableTypes = new[]
        {
            new CableType
            {
                Type = "Cable",
                Text = "RG11",
                High = 3.88,
                Mid = 3,
                Low = 0.93,
                XmitHigh = 0.75,
                XmitLow = 0.36,
                Length = 100
            },
            new CableType
            {
                Type = "Cable",
                Text = "RG59",
                High = 7.33,
                Mid = 5.7,
                Low = 1.78,
                XmitHigh = 1.45,
                XmitLow = 0.81,
                Length = 100
            },
            new CableType
            {
                Type = "Cable",
                Text = "RG6",
                High = 5.93,
                Mid = 4.7,
                Low = 1.44,
                XmitHigh = 1.17,
                XmitLow = 0.61,
                Length = 100
            }
        };

        public static readonly IEnumerable<PassiveDevice> PassiveDevice = new[]
        {
            new PassiveDevice
            {
                Type = "Device",
                Text = "3.5dB Port",
                High = 4.7,
                Mid = 4.2,
                Low = 4,
                XmitHigh = 4,
                XmitLow = 4.44
            },
            new PassiveDevice
            {
                Type = "Device",
                Text = "7.5dB Port",
                High = 8.1,
                Mid = 7.9,
                Low = 7.2,
                XmitHigh = 7.2,
                XmitLow = 7.5
            },
            //new PassiveDevice
            //{
            //    Type = "Device",
            //    Text = "3 Way – 3dB Port",
            //    High = 4.7,
            //    Mid = 4.2,
            //    Low = 3.8,
            //    XmitHigh = 3.8,
            //    XmitLow = 3.9
            //},
            new PassiveDevice
            {
                Type = "Device",
                Text = "DC12 Down",
                High = 13.2,
                Mid = 13.2,
                Low = 13.3,
                XmitHigh = 13.3,
                XmitLow = 13.8
            },
            new PassiveDevice
            {
                Type = "Device",
                Text = "DC12 Thru",
                High = 1.7,
                Mid = 1.2,
                Low = 1.1,
                XmitHigh = 1.1,
                XmitLow = 1.1
            },
            new PassiveDevice
            {
                Type = "Device",
                Text = "DC8 Down",
                High = 9.4,
                Mid = 9.1,
                Low = 9.1,
                XmitHigh = 9.1,
                XmitLow = 9.3
            },
            new PassiveDevice
            {
                Type = "Device",
                Text = "DC8 Thru",
                High = 2.4,
                Mid = 1.9,
                Low = 1.7,
                XmitHigh = 1.7,
                XmitLow = 1.9
            }
        };
    }
}