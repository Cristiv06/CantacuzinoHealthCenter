﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable enable
using System;
using System.Collections.Generic;

namespace DA.Entities;

public partial class Review
{
    public Guid Id { get; set; }

    public Guid IdPacient { get; set; }

    public Guid IdAppointment { get; set; }

    public int? Rating { get; set; }

    public string? ReviewMessage { get; set; }

    public virtual Appointment IdAppointmentNavigation { get; set; } = null!;

    public virtual Patient IdPacientNavigation { get; set; } = null!;
}