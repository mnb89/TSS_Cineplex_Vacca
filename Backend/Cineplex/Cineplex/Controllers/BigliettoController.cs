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
    public class BigliettoController : ControllerBase
    {
        private readonly cineplexContext _context;
        public BigliettoController(cineplexContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Biglietto>>> GetTicketByUserCode(string id)
        {
            string stm = "SELECT COD_OPERAZIONE,ORA_PROIEZIONE,DATA,TIPO_PAGAMENTO,QTA,biglietto.COD_FILM,film.TITOLO,film.ANNO,cinema.NOME,cinema.PROVINCIA FROM biglietto " +
                "INNER JOIN film ON film.COD_FILM == biglietto.COD_FILM " +
                "INNER JOIN cinema ON cinema.COD_CINEMA == film.COD_CINEMA " +
                "WHERE COD_VISITATORE ='"+id+"'";

            _context.con.Open();
            SQLiteCommand cmd = new SQLiteCommand(stm, _context.con);
            SQLiteDataReader rdr = cmd.ExecuteReader();

            List<Biglietto> obj = new List<Biglietto>();

            int i = 0;
            while (rdr.Read())
            {
                obj.Add(new Biglietto());
                obj[i].cod_operazione = rdr.GetInt32(0);
                obj[i].ora_proiezione = rdr.GetString(1);
                obj[i].data = rdr.GetString(2);
                obj[i].tipo_pagamento = rdr.GetString(3);
                obj[i].qta = rdr.GetInt32(4);
                obj[i].cod_film = rdr.GetString(5);
                obj[i].titolo = rdr.GetString(6) + " (" + rdr.GetString(7) + ")";
                obj[i].cinema = rdr.GetString(8);
                obj[i].prv = rdr.GetString(9);
                i++;
            }

            _context.con.Close();

            return obj;
        }

        [HttpPost("GetDuplicateTicket")]
        public Biglietto GetDuplicateTicket([FromBody] JsonElement body)
        {

            var codFilm = body.GetProperty("cod_film").GetString();
            var codUser = body.GetProperty("cod_visitatore").GetString();
            var date = body.GetProperty("data").GetString();
            var hour = body.GetProperty("ora_proiezione").GetString();

            string stm = "SELECT COD_OPERAZIONE, QTA, TIPO_PAGAMENTO FROM biglietto " +
                "WHERE COD_FILM='"+ codFilm + "' AND COD_VISITATORE='"+ codUser + "' AND DATA='"+ date + "' AND ORA_PROIEZIONE='"+ hour + "'";

            _context.con.Open();
            SQLiteCommand cmd = new SQLiteCommand(stm, _context.con);
            SQLiteDataReader rdr = cmd.ExecuteReader();
            if (!rdr.HasRows)
            {
                return null;
            }

            Biglietto obj = new Biglietto();

            int i = 0;
            while (rdr.Read())
            {
                obj.cod_operazione = rdr.GetInt32(0);
                obj.qta = rdr.GetInt32(1);
                obj.tipo_pagamento = rdr.GetString(2);
                i++;
            }

            _context.con.Close();

            return obj;
        }


        [HttpPost]
        public Biglietto CreateTicket([FromBody] JsonElement body)
        {

            Biglietto tk = new Biglietto();

            tk.cod_visitatore = body.GetProperty("cod_visitatore").GetString();
            tk.ora_proiezione = body.GetProperty("ora_proiezione").GetString();
            tk.data = body.GetProperty("data").GetString();
            tk.tipo_pagamento = body.GetProperty("tipo_pagamento").GetString();
            tk.qta = body.GetProperty("qta").GetInt32();
            tk.cod_film = body.GetProperty("cod_film").GetString();

            string stm = "INSERT INTO biglietto " +
                         "(COD_VISITATORE, ORA_PROIEZIONE, DATA, TIPO_PAGAMENTO, QTA, COD_FILM) " +
                         "VALUES ('"+ tk.cod_visitatore + "', '"+ tk.ora_proiezione + "', '"+ tk.data + "', '"+ tk.tipo_pagamento + "', "+ tk.qta + ", '" + tk.cod_film + "')";

            _context.con.Open();
            SQLiteCommand cmd = new SQLiteCommand(stm, _context.con);
            cmd.ExecuteNonQuery();
            _context.con.Close();

            return tk;
        }

        [HttpPatch]
        public Biglietto UpdateTicketQTA([FromBody] JsonElement body)
        {
            Biglietto tk = new Biglietto();

            tk.cod_operazione =  body.GetProperty("cod_operazione").GetInt32();
            tk.qta = body.GetProperty("qta").GetInt32();

            string stm = "UPDATE biglietto SET QTA =" + tk.qta + " WHERE COD_OPERAZIONE =" + tk.cod_operazione;
            _context.con.Open();
            SQLiteCommand cmd = new SQLiteCommand(stm, _context.con);
            cmd.ExecuteNonQuery();
            _context.con.Close();
            return tk;
        }


        [HttpDelete("{id}")]
        public int DeleteTicket(int id)
        {

            string stm = "DELETE FROM biglietto WHERE COD_OPERAZIONE =" + id;
            _context.con.Open();
            SQLiteCommand cmd = new SQLiteCommand(stm, _context.con);
            cmd.ExecuteNonQuery();
            _context.con.Close();
            return id;
        }


        [HttpPost("OccupiedPlaces")]
        public int OccupiedPlaces([FromBody] JsonElement body)
        {
            var oFilmCode = body.GetProperty("cod_film").GetString();
            var oHour = body.GetProperty("hour").GetString();
            var oDate = body.GetProperty("date").GetString();
            var oSpace = body.GetProperty("space").GetInt32();


            return this.CalculateSpace(oFilmCode, oHour, oSpace, oDate);
        }

        private int CalculateSpace(string cod_film, string hour, int space, string date)
        {
            string stm = "SELECT QTA FROM Biglietto WHERE COD_FILM ='"+cod_film+"' AND ORA_PROIEZIONE='"+hour+"' AND DATA='"+date+"'";

            _context.con.Open();
            SQLiteCommand cmd = new SQLiteCommand(stm, _context.con);
            SQLiteDataReader rdr = cmd.ExecuteReader();


            int oFree = space;

            while (rdr.Read())
            {
                oFree -= rdr.GetInt32(0);
            }

            _context.con.Close();
            return oFree;
        }
    }
}
