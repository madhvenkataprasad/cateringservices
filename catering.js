document.addEventListener('DOMContentLoaded', function() {
            console.log('catering.js loaded');

            const cateringServices = [{
                    name: "Delicious Bites",
                    lat: 40.7128,
                    lon: -74.0060,
                    cuisine: "Italian",
                    menuItems: ["MargheritaPizza", "PastaCarbonara", "Tiramisu"],
                    rating: 4.5
                },
                {
                    name: "Italian Feast",
                    lat: 40.7128,
                    lon: -74.0060,
                    cuisine: "Italian",
                    menuItems: ["Lasagna", "Bruschetta", "Gelato"],
                    rating: 4.2
                },
                {
                    name: "Pizza Palace",
                    lat: 40.7128,
                    lon: -74.0060,
                    cuisine: "Italian",
                    menuItems: ["PepperoniPizza", "Focaccia", "Cannoli"],
                    rating: 4.0
                },
                {
                    name: "Gourmet Catering",
                    lat: 40.7306,
                    lon: -73.9352,
                    cuisine: "French",
                    menuItems: ["CroqueMonsieur", "BeefBourguignon", "CrèmeBrûlée"],
                    rating: 4.8
                },
                {
                    name: "Tasty Treats",
                    lat: 40.7306,
                    lon: -73.9352,
                    cuisine: "American",
                    menuItems: ["Burgers", "Fries", "Milkshakes"],
                    rating: 4.3
                },
                {
                    name: "Spice Route",
                    lat: 40.7580,
                    lon: -73.9855,
                    cuisine: "Indian",
                    menuItems: ["ButterChicken", "Naan", "Samosa"],
                    rating: 4.7
                },
                {
                    name: "Curry House",
                    lat: 40.7580,
                    lon: -73.9855,
                    cuisine: "Indian",
                    menuItems: ["PaneerTikka", "Biryani", "GulabJamun"],
                    rating: 4.6
                },
                {
                    name: "Taco Express",
                    lat: 34.0522,
                    lon: -118.2437,
                    cuisine: "Mexican",
                    menuItems: ["Tacos", "Burritos", "Quesadillas"],
                    rating: 4.1
                },
                {
                    name: "Dragon Wok",
                    lat: 34.0522,
                    lon: -118.2437,
                    cuisine: "Chinese",
                    menuItems: ["ChowMein", "SpringRolls", "DimSum"],
                    rating: 4.4
                },
                {
                    name: "Sushi Master",
                    lat: 34.0522,
                    lon: -118.2437,
                    cuisine: "Japanese",
                    menuItems: ["Sushi", "Sashimi", "Tempura"],
                    rating: 4.9
                },
                {
                    name: "Thai Delight",
                    lat: 34.0522,
                    lon: -118.2437,
                    cuisine: "Thai",
                    menuItems: ["PadThai", "GreenCurry", "TomYumSoup"],
                    rating: 4.5
                }
            ];

            const locationForm = document.getElementById('locationForm');
            const resultText = document.getElementById('resultText');
            const serviceList = document.getElementById('serviceList');

            if (!locationForm || !resultText || !serviceList) {
                console.error('Required DOM elements not found:', {
                    locationForm,
                    resultText,
                    serviceList
                });
                return;
            }

            locationForm.addEventListener('submit', function(event) {
                        event.preventDefault();

                        const latitude = parseFloat(document.getElementById('latitude').value);
                        const longitude = parseFloat(document.getElementById('longitude').value);
                        const cuisine = document.getElementById('cuisine').value;
                        const menuItemsInput = document.getElementById('menuItemsInput').value;
                        const requestedItems = menuItemsInput ?
                            menuItemsInput.split(',').map(item => item.trim()) : [];

                        function haversineDistance(lat1, lon1, lat2, lon2) {
                            const R = 6371; // Radius of Earth in kilometers
                            const dLat = (lat2 - lat1) * Math.PI / 180;
                            const dLon = (lon2 - lon1) * Math.PI / 180;
                            const a =
                                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                                Math.sin(dLon / 2) * Math.sin(dLon / 2);
                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                            return R * c;
                        }

                        let nearestServices = cateringServices
                            .map(service => {
                                const distance = haversineDistance(latitude, longitude, service.lat, service.lon);
                                let matches = 0;
                                if (requestedItems.length > 0) {
                                    matches = requestedItems.filter(item =>
                                        service.menuItems.includes(item)
                                    ).length;
                                }
                                return {
                                    service,
                                    distance,
                                    matches
                                };
                            })
                            .filter(
                                ({
                                    distance,
                                    service
                                }) =>
                                distance <= 30 &&
                                (cuisine === "" || service.cuisine === cuisine)
                            )
                            .sort((a, b) => {
                                // Primary sort: by number of matching menu items (descending)
                                if (b.matches !== a.matches) {
                                    return b.matches - a.matches;
                                }
                                // Secondary sort: by distance (ascending)
                                return a.distance - b.distance;
                            });

                        if (nearestServices.length > 0) {
                            const maxMatches = nearestServices[0].matches;
                            const minDistance = nearestServices[0].distance;

                            const matchingServices = nearestServices.filter(
                                ({
                                    matches,
                                    distance
                                }) =>
                                matches === maxMatches && Math.abs(distance - minDistance) < 0.01
                            );

                            if (matchingServices.length > 0 && (requestedItems.length === 0 || maxMatches > 0)) {
                                resultText.textContent = `Found ${matchingServices.length} catering service(s) matching your criteria:`;
                                serviceList.innerHTML = matchingServices.map(({
                                            service,
                                            distance
                                        }) => `
                <li class="service-details">
                    <strong>${service.name}</strong> - ${distance.toFixed(2)} km away<br>
                    <strong>Cuisine:</strong> ${service.cuisine}<br>
                    <strong>Rating:</strong> ${service.rating} ⭐<br>
                    <strong>Menu Items:</strong>
                    <ul>${service.menuItems.map(item => `<li>${item}</li>`).join('')}</ul>
                </li>
            `).join('');
            } else {
                resultText.textContent = 'No catering services found within 30 km that match your criteria.';
                serviceList.innerHTML = '';
                console.log('No services found, redirecting to contact.html');
                // Use the global showLoading function from script.js
                showLoading('contact.html');
            }
        } else {
            resultText.textContent = 'No catering services found within 30 km that match your criteria.';
            serviceList.innerHTML = '';
            console.log('No services found, redirecting to contact.html');
            // Use the global showLoading function from script.js
            showLoading('contact.html');
        }
    });
});