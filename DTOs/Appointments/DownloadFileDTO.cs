using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTOs.Appointments
{
    public class DownloadFileDTO
    {
        public byte[] FileContent { get; set; }

        public string FileContentType { get; set; }

        public string FileName { get; set; }
    }
}
