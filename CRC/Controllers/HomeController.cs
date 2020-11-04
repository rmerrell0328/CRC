namespace CRC.Controllers
{
    using CRC.Data;
    using CRC.Models;
    using Microsoft.AspNetCore.Mvc;
    using System.Diagnostics;
    using System.Linq;

    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View(BaseData.Default.First());
        }

        public IActionResult Mobile()
        {
            return View(BaseData.Default.First());
        }

        public IActionResult Slider()
        {
            return View(BaseData.Default.First());
        }

        public IActionResult FormDeviceType()
        {
            return PartialView("_FormDeviceType");
        }

        public IActionResult FormCableType()
        {
            return PartialView("_FormCableType");
        }

        public IActionResult FormLength()
        {
            return PartialView("_FormLength");
        }

        public IActionResult FormTap()
        {
            return PartialView("_FormTap");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}