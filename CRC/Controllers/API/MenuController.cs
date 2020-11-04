namespace CRC.Controllers.API
{
    using CRC.Data;
    using DevExtreme.AspNet.Data;
    using DevExtreme.AspNet.Mvc;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.ModelBinding;
    using System.Collections.Generic;

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        public MenuController()
        {
        }

        [HttpGet]
        public object GetDefault(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(BaseData.Default, loadOptions);
        }

        [HttpGet]
        public object GetCableTypes(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(BaseData.CableTypes, loadOptions);
        }

        [HttpGet]
        public object GetPassiveDevices(DataSourceLoadOptions loadOptions)
        {
            return DataSourceLoader.Load(BaseData.PassiveDevice, loadOptions);
        }

        private string GetFullErrorMessage(ModelStateDictionary modelState)
        {
            var messages = new List<string>();

            foreach (var entry in modelState)
            {
                foreach (var error in entry.Value.Errors)
                    messages.Add(error.ErrorMessage);
            }

            return string.Join(" ", messages);
        }
    }
}