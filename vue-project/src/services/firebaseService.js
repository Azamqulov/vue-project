import { db } from "@/firebaseConfig"; // Firestore bazasini import qilish

export async function getTeacherByEmail(email) {
  const teacherRef = db.collection('teachers');
  const snapshot = await teacherRef.where('email', '==', email).get();

  if (snapshot.empty) {
    console.log('O‘qituvchi topilmadi.');
    return null;
  }

  const teacherData = snapshot.docs[0].data();
  return teacherData;
}

export async function getStudentsByTeacher(teacherEmail) {
  const studentsRef = db.collection('students');
  const query = studentsRef.where('teacherEmail', '==', teacherEmail);

  const snapshot = await query.get();
  const students = snapshot.docs.map(doc => doc.data());

  return students;
}

export async function getAllStudents() {
  const studentsRef = db.collection('students');
  const snapshot = await studentsRef.get();
  const students = snapshot.docs.map(doc => doc.data());

  return students;
}
