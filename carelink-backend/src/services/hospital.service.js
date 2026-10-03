/**
 * Facility Intelligence & Referral Matching Engine
 * Ranks healthcare facilities based on clinical capability, specialist availability, bed capacity, and distance
 */

function calculateDistanceKm(loc1 = {}, loc2 = {}) {
  // If coordinates provided, compute Haversine distance; otherwise return mock default
  if (loc1.lat && loc1.lng && loc2.lat && loc2.lng) {
    const R = 6371; // Earth radius in km
    const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
    const dLon = (loc2.lng - loc1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(loc1.lat * (Math.PI / 180)) * Math.cos(loc2.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }
  return 25; // standard fallback distance
}

function rankHospitals({ requiredSpecialty, patientLocation = {}, urgency = 'medium', maxDistance = 150, hospitals = [] }) {
  const scoredHospitals = hospitals.map(hospital => {
    let score = 0;
    const breakdown = {};

    // 1. Specialist Availability (30 pts max)
    const normalizedReq = (requiredSpecialty || '').toLowerCase().trim();
    const matchingSpecialist = (hospital.specialists || []).find(s =>
      s.specialty && s.specialty.toLowerCase().includes(normalizedReq)
    );

    if (matchingSpecialist && matchingSpecialist.availableToday) {
      score += 30;
      breakdown.specialist = { points: 30, text: `${matchingSpecialist.name} (${matchingSpecialist.specialty}) available today` };
    } else if (matchingSpecialist) {
      score += 15;
      breakdown.specialist = { points: 15, text: `${matchingSpecialist.name} next available ${matchingSpecialist.nextAvailable || 'tomorrow'}` };
    } else if ((hospital.specialties || []).some(s => s.toLowerCase().includes(normalizedReq))) {
      score += 10;
      breakdown.specialist = { points: 10, text: 'Specialty department exists; on-call coverage' };
    } else {
      breakdown.specialist = { points: 0, text: 'Specialist not listed today' };
    }

    // 2. Proximity Score (25 pts max, 25 - (distanceKm / 4))
    const distanceKm = calculateDistanceKm(patientLocation, hospital.coordinates);
    const proximityScore = Math.max(0, Math.min(25, 25 - (distanceKm / 4)));
    score += proximityScore;
    breakdown.proximity = { points: Math.round(proximityScore), distanceKm, text: `${distanceKm} km from patient location` };

    // 3. ICU Bed Capacity (15 pts max)
    const totalBeds = Math.max(Number(hospital.totalICUBeds || 0), 1);
    const availBeds = Number(hospital.availableICUBeds || 0);
    const icuScore = (availBeds / totalBeds) * 15;
    score += icuScore;
    breakdown.icu = { points: Math.round(icuScore), text: `${availBeds} of ${totalBeds} ICU beds available` };

    // 4. Facility Load (15 pts max, ((100 - currentLoad) / 100) * 15)
    const load = Number(hospital.currentLoad || 50);
    const loadScore = ((100 - load) / 100) * 15;
    score += loadScore;
    breakdown.facilityLoad = { points: Math.round(loadScore), currentLoad: load, text: `${load}% active capacity load` };

    // 5. Diagnostic Capabilities (10 pts max: CT & MRI = 10, either = 5)
    let diagScore = 0;
    if (hospital.hasCT && hospital.hasMRI) {
      diagScore = 10;
      breakdown.diagnostics = { points: 10, text: 'Full advanced imaging (CT + MRI on-site)' };
    } else if (hospital.hasCT || hospital.hasMRI) {
      diagScore = 5;
      breakdown.diagnostics = { points: 5, text: hospital.hasCT ? 'CT Scanner available' : 'MRI Scanner available' };
    } else {
      breakdown.diagnostics = { points: 0, text: 'Basic diagnostic imaging only' };
    }
    score += diagScore;

    // 6. Blood Bank (5 pts max)
    const bloodScore = hospital.hasBloodBank ? 5 : 0;
    score += bloodScore;
    breakdown.bloodBank = { points: bloodScore, text: hospital.hasBloodBank ? 'Blood Bank verified on-site' : 'No on-site blood bank' };

    const totalScore = Math.min(100, Math.round(score));

    return {
      hospitalId: hospital._id,
      name: hospital.name,
      district: hospital.district,
      type: hospital.type,
      totalScore,
      distanceKm,
      specialistInfo: matchingSpecialist || { name: 'On-call clinician', specialty: requiredSpecialty },
      availableICUBeds: hospital.availableICUBeds,
      totalICUBeds: hospital.totalICUBeds,
      currentLoad: hospital.currentLoad,
      estimatedWaitMinutes: hospital.estimatedWaitMinutes || 30,
      hasCT: hospital.hasCT,
      hasMRI: hospital.hasMRI,
      hasBloodBank: hospital.hasBloodBank,
      scoreBreakdown: breakdown,
      recommendationReason: `Ranked #${totalScore}/100 based on ${breakdown.specialist.text}, ${distanceKm}km travel distance, and ${breakdown.icu.text}.`
    };
  });

  // Sort descending by total composite score
  scoredHospitals.sort((a, b) => b.totalScore - a.totalScore);

  return scoredHospitals.slice(0, 3);
}

module.exports = {
  calculateDistanceKm,
  rankHospitals
};
