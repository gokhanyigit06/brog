import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Firebase Admin SDK — YALNIZ sunucuda çalışır ve Firestore güvenlik kurallarını
// BYPASS eder. Bu yüzden `leads` koleksiyonu istemciye kapalı olsa da (bkz.
// firestore.rules) admin paneli buradan okuyup yazabilir.
//
// Kimlik bilgisi: servis hesabı JSON'u base64'lenmiş halde FIREBASE_SERVICE_ACCOUNT_B64
// env değişkeninde. Anahtar repoya ASLA girmez (.env.local + deploy ortamı gizli değişkeni).

function loadCredential() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_B64 tanımlı değil — admin leads API'si çalışmaz. " +
        ".env.local (ve deploy ortamı) içine servis hesabı anahtarının base64'ünü ekleyin."
    );
  }
  const json = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  return cert({
    projectId: json.project_id,
    clientEmail: json.client_email,
    privateKey: json.private_key,
  });
}

const app: App =
  getApps().length > 0 ? getApps()[0] : initializeApp({ credential: loadCredential() });

export const adminDb = getFirestore(app);

// Storage: demo vitrini dosyaları buradan okunur. Admin SDK güvenlik kurallarını
// bypass ettiği için `demolar/` istemciye tamamen kapalı olabiliyor (storage.rules).
export const adminBucket = () =>
  getStorage(app).bucket(
    process.env.FIREBASE_STORAGE_BUCKET || "brog-1acb3.firebasestorage.app"
  );
