using Cineplex.Contexts;
using Cineplex.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Cineplex.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilmController : ControllerBase
    {
        private readonly cineplexContext _context;
        //private string CS;

        public FilmController(cineplexContext context)
        {
            //CS = "Data Source = F:\\CORSO TSS\\COMPITO FINALE\\TSS_Cineplex_Vacca\\Backend\\cineplex.db";
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Film>>> GetAll()
        {
            string stm = "SELECT COD_FILM,TITOLO,REGISTA,GENERE,CINEMA.PROVINCIA,CINEMA.CAPIENZA FROM FILM INNER JOIN CINEMA ON FILM.COD_CINEMA = CINEMA.COD_CINEMA ORDER BY TITOLO";

            _context.con.Open();
            SQLiteCommand cmd = new SQLiteCommand(stm, _context.con);
            SQLiteDataReader rdr = cmd.ExecuteReader();

            List<Film> obj = new List<Film>();

            int i = 0;
            while (rdr.Read())
            {
                obj.Add(new Film());
                obj[i].cod_film = rdr.GetString(0);
                obj[i].titolo = rdr.GetString(1);
                obj[i].regista = rdr.GetString(2);
                obj[i].genere = rdr.GetString(3);
                obj[i].provincia = rdr.GetString(4);
                obj[i].capienza = rdr.GetInt32(5);
                i++;
            }

            _context.con.Close();

            return obj;
        }

        [HttpPost]
        public Film GetFilmByCode([FromBody] JsonElement body)

        {
            var oCode = body.GetProperty("cod_film").ToString();

            string stm = "SELECT TRAMA,ANNO,DATA_INIZIO,DATA_FINE,PREZZO,POSTER,CINEMA.COD_CINEMA,CINEMA.NOME,CINEMA.INDIRIZZO FROM FILM INNER JOIN CINEMA ON FILM.COD_CINEMA = CINEMA.COD_CINEMA WHERE COD_FILM = '"+oCode+"'";

            _context.con.Open();
            SQLiteCommand cmd = new SQLiteCommand(stm, _context.con);
            SQLiteDataReader rdr = cmd.ExecuteReader();

            Film obj = new Film();

            int i = 0;
            while (rdr.Read())
            {
                obj.trama = rdr.GetString(0);
                obj.anno = rdr.GetString(1);
                obj.data_inizio = rdr.GetString(2);
                obj.data_fine = rdr.GetString(3);
                obj.prezzo = rdr.GetString(4);
                obj.poster = rdr.GetString(5);
                obj.cod_cinema = rdr.GetString(6);
                obj.nome = rdr.GetString(7);
                obj.indirizzo = rdr.GetString(8);
                obj.spazioLibero = 0;
                i++;
            }

            _context.con.Close();

            return obj;
        }

    }
}
