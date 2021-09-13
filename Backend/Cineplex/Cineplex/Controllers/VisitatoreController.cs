using Cineplex.Contexts;
using Cineplex.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace Cineplex.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitatoreController : ControllerBase
    {
        private readonly cineplexContext _context;

        public VisitatoreController(cineplexContext context)
        {
            //CS = "Data Source = F:\\CORSO TSS\\COMPITO FINALE\\TSS_Cineplex_Vacca\\Backend\\cineplex.db";
            _context = context;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Visitatore>>> GetAll()
        {
            string stm = "SELECT * FROM visitatore";

            _context.con.Open();
            SQLiteCommand cmd = new SQLiteCommand(stm, _context.con);
            SQLiteDataReader rdr = cmd.ExecuteReader();

            List<Visitatore> obj = new List<Visitatore>();

            int i = 0;
            while (rdr.Read())
            {
                obj.Add(new Visitatore());
                obj[i].cod_visitatore = rdr.GetString(0);
                obj[i].cognome = rdr.GetString(1);
                obj[i].nome = rdr.GetString(2);
                obj[i].telefono = rdr.GetString(3);
                obj[i].email = rdr.GetString(4);
                obj[i].user = rdr.GetString(5);
                obj[i].psw = rdr.GetString(6);
                i++;
            }

            _context.con.Close();

            return obj;
        }

        [HttpPost]
        public Visitatore GetVisitatoreForLogin([FromBody] JsonElement body)
        {

            string oUsr = body.GetProperty("username").GetString();
            string oPsw = body.GetProperty("password").GetString();

            string stm = "SELECT * FROM visitatore WHERE USER = '"+ oUsr + "' AND PSW = '"+ oPsw + "' ";

            _context.con.Open();
            SQLiteCommand cmd = new SQLiteCommand(stm, _context.con);
            SQLiteDataReader rdr = cmd.ExecuteReader();
            if(!rdr.HasRows)
            {
                return null;
            }

            Visitatore obj = new Visitatore();

            while (rdr.Read())
            {
                obj.cod_visitatore = rdr.GetString(0);
                obj.cognome = rdr.GetString(1);
                obj.nome = rdr.GetString(2);
                obj.telefono = rdr.GetString(3);
                obj.email = rdr.GetString(4);
                obj.user = rdr.GetString(5);
                obj.psw = rdr.GetString(6);
            }

            _context.con.Close();

            return obj;
        }
    }
}
