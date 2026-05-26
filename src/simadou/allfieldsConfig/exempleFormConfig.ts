import type { FormConfig } from "../../Global/types/formConfig";



export const getUserFormConfig = (): FormConfig => ({
  // premier cas


  //----------------------
  fields: [
    // text
    {
      name: "nom",
      label: "Nom",
      type: "text",
      placeholder: "Nom de famille",
      required: true,
      gridCols:1,
    },
    //textarea
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Description détaillée...",
      rows: 4,
      gridCols: 1,
    },
    //video
    {
      name: "video",
      label: "Vidéo",
      type: "video",
      accept: "video/*",
      maxSize: 30, // 30MB max
      helperText: "Formats acceptés: MP4, AVI, MOV (max 30MB)",
      gridCols: 2,
    },
    //image
    {
      name: "photo",
      label: "Photo",
      type: "image",
      accept: "image/*",
      maxSize: 5, // 5MB max
      helperText: "Formats acceptés: JPG, PNG, GIF (max 5MB)",
      gridCols: 2,
    },
    //audio
    {
      name: "audio",
      label: "Audio",
      type: "audio",
      accept: "audio/*",
      maxSize: 10, // 10MB max
      helperText: "Formats acceptés: MP3, WAV, OGG (max 10MB)",
      gridCols: 2,
    },
    //checkbox
    {
      name: "statut",
      label: "Statut",
      type: "checkbox",
      defaultChecked: true,
      gridCols: 2,
    },
  ],

  //------------------------------------------------
  //------------------------------------------------
  // 2eme cas
 
  // vous definissez le nombre de step ici
  // steps: [
  //   {
  //     step: 1,
  //     title: "Identité",
  //     description: "Informations personnelles de base",
  //   },
  //   {
  //     step: 2,
  //     title: "Coordonnées",
  //     description: "Localisation et contact",
  //   },
  //   {
  //     step: 3,
  //     title: "Médias",
  //     description: "Photos et vidéos de présentation",
  //   },
  // ],

  // et vous associez chaque champ à un step

  // fields: [
  //   // ── Step 1 : Identité ────────────────────────────────────────
  //   {
  //     name: "nom",
  //     label: "Nom",
  //     type: "text",
  //     placeholder: "Ex: Diallo",
  //     required: true,
  //     gridCols: 1,
  //     formStep: 1,
  //   },
  //   {
  //     name: "prenom",
  //     label: "Prénom",
  //     type: "text",
  //     placeholder: "Ex: Aissatou",
  //     required: true,
  //     gridCols: 1,
  //     formStep: 2,
  //   },
  //   {
  //     name: "age",
  //     label: "Âge",
  //     type: "number",
  //     placeholder: "Ex: 22",
  //     required: true,
  //     min: 18,
  //     gridCols: 1,
  //     formStep: 3,
  //   }
  // ],


});