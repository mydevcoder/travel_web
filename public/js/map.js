
    const MAPTILER_KEY = "rwN4tbu6RrYvXWsdGC7n"; // Replace with your free key

    // Initialize map (default: New Delhi)
    const map = L.map("map").setView([28.6139, 77.2090], 12);

    // Add MapTiler tiles
    L.tileLayer(`https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`, {
      attribution:
        '© <a href=\"https://www.maptiler.com/\" target=\"_blank\">MapTiler</a> © <a href=\"https://www.openstreetmap.org/\" target=\"_blank\">OpenStreetMap</a>',
      tileSize: 256,
    }).addTo(map);

    let marker;

    // Click to drop a marker
    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      if (marker) marker.remove();
      marker = L.marker([lat, lng]).addTo(map).bindPopup(`📍 ${lat.toFixed(5)}, ${lng.toFixed(5)}`).openPopup();

      const name = prompt("Enter a name for this tourist spot:");
      if (name) {
        await fetch("/map/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, lat, lng }),
        });
        alert("Saved successfully!");
      }
    });

    // Load existing markers from DB
    const existingLocations =  JSON.stringify(locations) ;
    existingLocations.forEach(loc => {
      L.marker([loc.lat, loc.lng])
        .addTo(map)
        .bindPopup(`<b>${loc.name}</b><br>${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`);
    });

    // Locate user
    document.getElementById("locateBtn").addEventListener("click", () => {
      if (!navigator.geolocation) return alert("Geolocation not supported!");
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 14);
        if (marker) marker.remove();
        marker = L.marker([latitude, longitude]).addTo(map).bindPopup("You are here").openPopup();
      });
    });
