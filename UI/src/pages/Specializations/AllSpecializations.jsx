import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSpecializationService from "../../services/SpecializationService";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import img1 from "../../../public/Specializations/1.jpg";
import img2 from "../../../public/Specializations/2.jpg";
import img3 from "../../../public/Specializations/3.jpg";
import img4 from "../../../public/Specializations/4.jpg";
import img5 from "../../../public/Specializations/5.jpg";
import img6 from "../../../public/Specializations/6.jpg";
import img7 from "../../../public/Specializations/7.jpg";
import img8 from "../../../public/Specializations/8.jpg";
import img9 from "../../../public/Specializations/9.jpg";
import img10 from "../../../public/Specializations/10.jpg";

const AllSpecializations = () => {
  let imgArr = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];
  const { getAllSpecializations } = useSpecializationService();
  const [specializationList, setSpecializationList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      let specializations = await getAllSpecializations();
      setSpecializationList(specializations);
    };
    getData();
  }, []);

  return (
    <Grid
      container
      spacing={2}
      style={{ marginTop: "20px", paddingLeft: "60px", paddingRight: "60px" }}
    >
      {specializationList.map((specialization) => (
        <Grid item key={specialization.id} xs={12} sm={6} md={4} lg={4}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(to right, #ffffff, #f8f9fa)",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardMedia
              component="img"
              alt={specialization.name}
              height="140"
              image={imgArr[specialization.id - 1]}
              sx={{ objectFit: "cover" }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {specialization.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {specialization.defaultPrice} - {specialization.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                component={Link}
                to={`/doctors?specializationId=${specialization.id}`}
                size="small"
                variant="contained"
                color="primary"
              >
                See Available Doctors
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AllSpecializations;
