import React, { useEffect, useState } from "react";
import useAuthService from "../../services/UserService";
import useDoctorService from "../../services/DoctorService";
import Roles from "../../statics/Roles";
import backgroundImage from "../../components/infrastructure/homePageBackground.jpg";
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import userSession from "../../utils/userSession";
import useDocumentService from "../../services/DocumentService";

const Profile = () => {
  const { profileDetails, profileUpdate, profileUpdateDoctor } =
    useAuthService();
  const { getSpecializations } = useDoctorService();
  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [availableSpecializations, setAvailableSpecializations] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  const getData = async () => {
    const profileUser = await profileDetails();
    axios({
      url:
        `${import.meta.env.VITE_API_URL}/storage/download/` +
        profileUser.photoId,
      method: "GET",
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${userSession.token()}`,
        ContentType: "application/json",
      },
    }).then((response) => {
      const href = URL.createObjectURL(response.data);
      setPhotoUrl(href);
    });
    setProfile(profileUser);
    setOriginalProfile(profileUser);
    setUserRole(profileUser.roleId);

    if (profileUser.roleId === Roles.Doctor) {
      const specializations = await getSpecializations();
      console.log("Specializations fetched: ", specializations);
      setAvailableSpecializations(specializations);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleCustomPriceChange = (id, value) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      specializationsList: prevProfile.specializationsList.map((spec) =>
        spec.id === id ? { ...spec, customPrice: value } : spec
      ),
    }));
  };

  const handleAddSpecialization = (specializationId) => {
    const selectedSpecialization = availableSpecializations.find(
      (spec) => spec.id === parseInt(specializationId)
    );

    if (selectedSpecialization) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        specializationsList: [
          ...prevProfile.specializationsList,
          {
            id: selectedSpecialization.id,
            customPrice: selectedSpecialization.originalPrice,
            doctorSpecializationsId:
              selectedSpecialization.doctorSpecializationsId,
          },
        ],
      }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setPhotoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleEditClick = () => {
    if (isEditing) {
      setProfile(originalProfile);
    } else {
      setOriginalProfile(profile);
    }
    setIsEditing((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userRole === Roles.Doctor) {
      profileUpdateDoctor(profile, file).then(() => {
        setOriginalProfile(profile);
        setIsEditing(false);
      });
    } else {
      profileUpdate(profile, file).then(() => {
        setOriginalProfile(profile);
        setIsEditing(false);
      });
    }
  };

  if (!profile) {
    return <>Loading...</>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "10px",
      }}
    >
      {userRole === Roles.Doctor ? (
        <DoctorProfile
          profile={profile}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleCustomPriceChange={handleCustomPriceChange}
          handleSubmit={handleSubmit}
          handleEditClick={handleEditClick}
          availableSpecializations={availableSpecializations}
          handleAddSpecialization={handleAddSpecialization}
          handleFileChangeDoctor={handleFileChange}
          doctorPhotoUrl={photoUrl}
          file={file}
        />
      ) : userRole === Roles.Patient ? (
        <PatientProfile
          profile={profile}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleEditClick={handleEditClick}
          handleFileChangePatient={handleFileChange}
          patientPhotoUrl={photoUrl}
          file={file}
        />
      ) : (
        <>Invalid user role</>
      )}
    </div>
  );
};

const DoctorProfile = ({
  profile,
  isEditing,
  handleInputChange,
  handleCustomPriceChange,
  handleSubmit,
  handleEditClick,
  availableSpecializations,
  handleAddSpecialization,
  handleFileChangeDoctor,
  doctorPhotoUrl,
}) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        background: "linear-gradient(to right, #ffffff, #f8f9fa)",
        padding: 3,
        width: "100%",
        maxWidth: 800,
        mx: "auto",
        overflowY: "auto",
        maxHeight: "100%",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{ color: "#1976d2" }}
      >
        Doctor Profile
      </Typography>
      {!isEditing ? (
        <>
          <img
            src={doctorPhotoUrl}
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
            }}
            alt="Photo"
          />
          <Typography>Degree: {profile.degreeName}</Typography>
          <Typography>First Name: {profile.firstName}</Typography>
          <Typography>Last Name: {profile.lastName}</Typography>

          <Typography variant="h6">Specializations:</Typography>
          <Box component="ul" sx={{ listStyleType: "none", padding: 0 }}>
            {profile.specializationsList.map((specialization) => {
              const specializationDetails = availableSpecializations.find(
                (spec) => spec.id === specialization.id
              );

              return (
                <Box
                  component="li"
                  key={specialization.doctorSpecializationsId}
                  sx={{ mb: 1 }}
                >
                  <Typography>
                    Specialization: {specializationDetails?.name || "N/A"}
                  </Typography>
                  <Typography>
                    Default Price: $
                    {specializationDetails?.defaultPrice || "N/A"}
                  </Typography>
                  <Typography>
                    Custom Price: ${specialization.customPrice}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </>
      ) : (
        <>
          <div style={{ textAlign: "center" }}>
            <img
              src={doctorPhotoUrl}
              alt="Uploaded File Preview"
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>
          <Button variant="contained" component="label">
            Choose Profile Picture
            <input type="file" hidden onChange={handleFileChangeDoctor} />
          </Button>
          <TextField
            id="degreeName"
            name="degreeName"
            label="Degree"
            value={profile.degreeName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="firstName"
            name="firstName"
            label="First Name"
            value={profile.firstName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="lastName"
            name="lastName"
            label="Last Name"
            value={profile.lastName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />

          <Typography variant="h6">Specializations:</Typography>
          <Box component="ul" sx={{ listStyleType: "none", padding: 0 }}>
            {profile.specializationsList.map((specialization) => {
              const specializationDetails = availableSpecializations.find(
                (spec) => spec.id === specialization.id
              );

              return (
                <Box
                  component="li"
                  key={specialization.doctorSpecializationsId}
                  sx={{ mb: 1 }}
                >
                  <Typography>
                    Specialization: {specializationDetails?.name || "N/A"}
                  </Typography>
                  <Typography>
                    Default Price: $
                    {specializationDetails?.defaultPrice || "N/A"}
                  </Typography>
                  <TextField
                    label="Custom Price"
                    type="number"
                    step="0.01"
                    value={specialization.customPrice}
                    onChange={(e) =>
                      handleCustomPriceChange(specialization.id, e.target.value)
                    }
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
              );
            })}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography>Add Specialization:</Typography>
            <Select
              fullWidth
              onChange={(e) => handleAddSpecialization(e.target.value)}
              displayEmpty
              defaultValue=""
            >
              <MenuItem value="" disabled>
                Select a specialization
              </MenuItem>
              {availableSpecializations.map((spec) => (
                <MenuItem key={spec.id} value={spec.id}>
                  {spec.name} - Default Price: ${spec.defaultPrice}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              mt: 2,
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Save
          </Button>
        </>
      )}
      <Button
        variant={isEditing ? "outlined" : "contained"}
        color="primary"
        onClick={handleEditClick}
        sx={{
          mt: 2,
          color: isEditing ? "#1976d2" : "#fff",
          backgroundColor: isEditing ? "transparent" : "#1976d2",
          borderColor: "#1976d2",
          "&:hover": {
            borderColor: isEditing ? "#1565c0" : "#1565c0",
            backgroundColor: isEditing ? "#e3f2fd" : "#1565c0",
            color: isEditing ? "#1976d2" : "#fff",
          },
        }}
      >
        {isEditing ? "Cancel" : "Edit"}
      </Button>
    </Card>
  );
};

const PatientProfile = ({
  profile,
  isEditing,
  handleInputChange,
  handleSubmit,
  handleEditClick,
  handleFileChangePatient,
  patientPhotoUrl,
}) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        background: "linear-gradient(to right, #ffffff, #f8f9fa)",
        padding: 3,
        width: "100%",
        maxWidth: 800,
        mx: "auto",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{ color: "#1976d2" }}
      >
        Patient Profile
      </Typography>
      {!isEditing ? (
        <div style={{ textAlign: "center" }}>
          <img
            src={patientPhotoUrl}
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
            }}
            alt="Photo"
          />
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            First Name: {profile.firstName}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Last Name: {profile.lastName}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Email: {profile.email}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Age: {profile.age}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Address: {profile.address}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Health Issues: {profile.healthIssues}
          </Typography>
        </div>
      ) : (
        <>
          <div style={{ textAlign: "center" }}>
            <img
              src={patientPhotoUrl}
              alt="Uploaded File Preview"
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </div>
          <Button variant="contained" component="label">
            Choose Profile Picture
            <input type="file" hidden onChange={handleFileChangePatient} />
          </Button>
          <TextField
            id="firstName"
            name="firstName"
            label="First Name"
            value={profile.firstName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="lastName"
            name="lastName"
            label="Last Name"
            value={profile.lastName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="email"
            name="email"
            label="Email"
            value={profile.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="age"
            name="age"
            label="Age"
            value={profile.age}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            type="number"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="address"
            name="address"
            label="Address"
            value={profile.address}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="healthIssues"
            name="healthIssues"
            label="Health Issues"
            value={profile.healthIssues}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              mt: 2,
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Save
          </Button>
        </>
      )}
      <Button
        variant={isEditing ? "outlined" : "contained"}
        color="primary"
        onClick={handleEditClick}
        sx={{
          mt: 2,
          color: isEditing ? "#1976d2" : "#fff",
          backgroundColor: isEditing ? "transparent" : "#1976d2",
          borderColor: "#1976d2",
          "&:hover": {
            borderColor: isEditing ? "#1565c0" : "#1565c0",
            backgroundColor: isEditing ? "#e3f2fd" : "#1565c0",
            color: isEditing ? "#1976d2" : "#fff",
          },
        }}
      >
        {isEditing ? "Cancel" : "Edit"}
      </Button>
    </Card>
  );
};

export default Profile;
