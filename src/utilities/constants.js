class Admin {
  static MASTER = "master";
  static SENIOR = "senior";
  static SUPPORT = "support";
}

class Type {
  static SERIES = 1000;
  static QUIZ = 1010;
}

const subjects = [
  { key: "EE", text: "Electrical Engineering" },
  { key: "ME", text: "Mechanical Engineering" },
  { key: "CS", text: "Computer Science and Information Technology" },
  { key: "MT", text: "Metallurgical Engineering Section" },
  { key: "IN", text: "Instrumentation Engineering" },
  { key: "EC", text: "Electronics and Communications" },
  { key: "CE", text: "Civil Engineering" },
  { key: "CH", text: "Chemical Engineering" },
  { key: "GG", text: "Geology and Geophysics" },
  { key: "CY", text: "Chemistry" },
];

export { Admin, Type, subjects };
