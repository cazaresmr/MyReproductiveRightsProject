import pool from "./db.js";

export const fetchMedicaidCoverage = async (stateCode) => {
  if (!stateCode) {
    console.error("fetchMedicaidCoverage called with undefined stateCode");
    return "State code is undefined";
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM coverage WHERE state_code = ?",
      [stateCode]
    );
    const stateData = rows[0];

    if (stateData) {
      const medicaidKeys = Object.keys(stateData).filter(
        (key) => key.includes("medicaid") && stateData[key] === 1
      );

      const coverageDescriptions = medicaidKeys.map((key) =>
        key.split("_").slice(2).join(" ")
      );

      return `In ${stateCode}, Medicaid covers abortion when it's: ${coverageDescriptions.join(
        ", "
      )}.`;
    } else {
      return `No data found for state: ${stateCode}`;
    }
  } catch (error) {
    return `Error fetching data: ${error.message}`;
  }
};
