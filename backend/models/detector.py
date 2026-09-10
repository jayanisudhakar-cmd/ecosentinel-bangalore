"""
EcoSentinel Bangalore - Satellite Computer Vision Landfill Detector
Processes satellite/aerial imagery feeds to detect unauthorized plastic waste
clusters in the Shanthi Nagar / Double Road (K.H. Road) urban corridor.

Pipeline:
1. Ground Sampling Distance (GSD) calibrated frame generation/ingestion.
2. Color space transformation: BGR to HSV.
3. Multi-spectral plastic signature thresholding (Blue Tarp & High-Reflectance PE).
4. Morphological noise cancellation and spatial cluster fusion.
5. Contour extraction, bounding box computation, and centroid localization.
6. Geospatial mapping to Bengaluru Ward 111 coordinates.
7. Estimated plastic surface area (m²) and tonnage calculation.
8. Severity assignment (LOW, MODERATE, SEVERE, CRITICAL).
"""

import cv2
import numpy as np
import base64
from typing import Dict, List, Tuple, Any


class SatelliteLandfillDetector:
    def __init__(self, gsd_meters_per_pixel: float = 0.25):
        """
        :param gsd_meters_per_pixel: Ground Sampling Distance in meters per pixel.
                                     0.25m corresponds to ultra-high-res aerial/drone or high-res commercial satellite.
        """
        self.gsd = gsd_meters_per_pixel
        # Reference bounds for Shanthi Nagar / Double Road (Ward 111)
        self.geo_bounds = {
            "lat_min": 12.9480,
            "lat_max": 12.9620,
            "lon_min": 77.5880,
            "lon_max": 77.6020,
        }
        # Known landmark anchors in Shanthi Nagar / Double Road
        self.landmark_anchors = [
            {"name": "BMTC Shanthi Nagar Depot Rear Yard", "lat": 12.9542, "lon": 77.5938, "pixel_x": 420, "pixel_y": 450},
            {"name": "Double Road (K.H. Road) Flyover Underpass", "lat": 12.9585, "lon": 77.5925, "pixel_x": 320, "pixel_y": 250},
            {"name": "Akkithimmanahalli SWD Drainage Buffer", "lat": 12.9568, "lon": 77.5971, "pixel_x": 650, "pixel_y": 320},
            {"name": "Wilson Garden 10th Cross Periphery", "lat": 12.9495, "lon": 77.5940, "pixel_x": 430, "pixel_y": 700},
            {"name": "Lalbagh East Gate Transit Verge", "lat": 12.9515, "lon": 77.5898, "pixel_x": 150, "pixel_y": 580},
        ]

    def pixel_to_latlon(self, x: int, y: int, width: int = 800, height: int = 800) -> Tuple[float, float]:
        """Convert image pixel coordinates to approximate latitude/longitude."""
        norm_x = x / float(width)
        norm_y = y / float(height)

        lon = self.geo_bounds["lon_min"] + norm_x * (self.geo_bounds["lon_max"] - self.geo_bounds["lon_min"])
        # Latitude decreases as y increases (top to bottom)
        lat = self.geo_bounds["lat_max"] - norm_y * (self.geo_bounds["lat_max"] - self.geo_bounds["lat_min"])
        return round(float(lat), 6), round(float(lon), 6)

    def generate_synthetic_aerial_tile(self, width: int = 800, height: int = 800, seed: int = 42) -> np.ndarray:
        """
        Generate a realistic synthetic high-resolution aerial tile representing the
        Shanthi Nagar / K.H. Double Road corridor, including asphalt roads, green canopies,
        building rooftops, stormwater drain corridors, and unauthorized plastic waste deposits.
        """
        np.random.seed(seed)
        # Background: urban soil/pavement tone (BGR format: grayish-brown)
        image = np.full((height, width, 3), (75, 80, 85), dtype=np.uint8)

        # Add texture noise
        noise = np.random.normal(0, 8, (height, width, 3)).astype(np.int16)
        image = np.clip(image.astype(np.int16) + noise, 0, 255).astype(np.uint8)

        # 1. Double Road (K.H. Road) - Major 4-lane arterial running diagonally north-south
        cv2.line(image, (260, 0), (450, 800), (45, 48, 52), 48)  # Asphalt base
        cv2.line(image, (260, 0), (450, 800), (220, 220, 220), 2)  # Center divider

        # 2. Shanthi Nagar Bus Stand access road & cross streets
        cv2.line(image, (0, 360), (800, 420), (50, 53, 56), 32)
        cv2.line(image, (350, 0), (200, 800), (55, 58, 62), 24)

        # 3. Akkithimmanahalli Stormwater Drain (SWD - Rajakaluve channel)
        pts = np.array([[600, 0], [630, 250], [680, 500], [740, 800]], np.int32)
        cv2.polylines(image, [pts], False, (70, 60, 45), 20)

        # 4. Lalbagh Periphery Vegetation Canopy (deep green / organic clumps)
        for _ in range(35):
            cx = np.random.randint(20, 220)
            cy = np.random.randint(450, 780)
            radius = np.random.randint(18, 45)
            cv2.circle(image, (cx, cy), radius, (35, np.random.randint(100, 160), 40), -1)

        # 5. Urban Building Rooftops (concrete and terracotta polygons)
        buildings = [
            (80, 80, 140, 100, (140, 145, 150)),
            (500, 90, 180, 120, (160, 165, 170)),
            (120, 230, 110, 90, (110, 130, 160)),
            (520, 480, 150, 140, (130, 140, 145)),
            (680, 200, 90, 160, (145, 150, 155)),
        ]
        for bx, by, bw, bh, color in buildings:
            cv2.rectangle(image, (bx, by), (bx + bw, by + bh), color, -1)
            cv2.rectangle(image, (bx, by), (bx + bw, by + bh), (40, 40, 40), 2)

        # 6. Synthesize Unauthorized Plastic Waste Clusters at strategic hotspots
        # Hotspot 1: BMTC Bus Depot Rear Yard (Severe dumping - Blue tarps & dense LDPE)
        self._inject_waste_cluster(image, 420, 450, 45, 35, blue_ratio=0.6)

        # Hotspot 2: Double Road Flyover Underside (Moderate dumping - high reflectance PE bags)
        self._inject_waste_cluster(image, 320, 250, 30, 25, blue_ratio=0.3)

        # Hotspot 3: Akkithimmanahalli SWD Buffer (Critical dumping - sprawling debris along drain)
        self._inject_waste_cluster(image, 650, 320, 60, 45, blue_ratio=0.7)

        # Hotspot 4: Wilson Garden 10th Cross Periphery (Low/Moderate dumping)
        self._inject_waste_cluster(image, 430, 700, 25, 20, blue_ratio=0.2)

        # Hotspot 5: Lalbagh Transit Verge (Low isolated plastic dump)
        self._inject_waste_cluster(image, 150, 580, 22, 18, blue_ratio=0.4)

        return image

    def _inject_waste_cluster(self, img: np.ndarray, cx: int, cy: int, radius_x: int, radius_y: int, blue_ratio: float = 0.5):
        """Helper to paint realistic irregular high-reflectance and blue tarp plastic debris."""
        num_patches = np.random.randint(18, 36)
        for _ in range(num_patches):
            px = int(np.random.normal(cx, radius_x * 0.4))
            py = int(np.random.normal(cy, radius_y * 0.4))
            w = np.random.randint(4, 14)
            h = np.random.randint(4, 14)

            # Either blue tarpaulin (BGR: strong blue/cyan) or high-reflectance polythene (near white)
            if np.random.rand() < blue_ratio:
                # Blue tarp: BGR high blue (180-245), low red (20-60), mid green (80-140)
                color = (np.random.randint(190, 255), np.random.randint(80, 150), np.random.randint(20, 60))
            else:
                # White/translucent plastic: BGR high across all channels
                bright = np.random.randint(215, 255)
                color = (bright, bright, bright)

            cv2.ellipse(img, (px, py), (w, h), np.random.randint(0, 180), 0, 360, color, -1)

    def process_frame(self, image: np.ndarray = None) -> Dict[str, Any]:
        """
        Execute the full Computer Vision detection pipeline on the provided or generated frame.
        Returns detection metadata, anomalies, severity ratings, and base64 images.
        """
        if image is None:
            image = self.generate_synthetic_aerial_tile()

        height, width = image.shape[:2]

        # Step 1: Convert BGR to HSV
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

        # Step 2: Define plastic signature color ranges in HSV space
        # Blue tarps: Hue 90-135, Saturation 60-255, Value 60-255
        lower_blue_tarp = np.array([90, 60, 60])
        upper_blue_tarp = np.array([135, 255, 255])
        mask_blue = cv2.inRange(hsv, lower_blue_tarp, upper_blue_tarp)

        # High-reflectance polythene/LDPE/HDPE: Low saturation (0-40), high brightness (205-255)
        lower_white_plastic = np.array([0, 0, 205])
        upper_white_plastic = np.array([180, 45, 255])
        mask_white = cv2.inRange(hsv, lower_white_plastic, upper_white_plastic)

        # Combined plastic mask
        raw_mask = cv2.bitwise_or(mask_blue, mask_white)

        # Step 3: Morphological filtering (remove small sensor noise, bridge clusters)
        kernel_open = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        kernel_close = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))

        mask_opened = cv2.morphologyEx(raw_mask, cv2.MORPH_OPEN, kernel_open, iterations=1)
        clean_mask = cv2.morphologyEx(mask_opened, cv2.MORPH_CLOSE, kernel_close, iterations=2)

        # Step 4: Contour Extraction
        contours, _ = cv2.findContours(clean_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        annotated = image.copy()
        detections = []
        total_plastic_area_m2 = 0.0
        total_plastic_tonnage = 0.0

        detection_id = 1
        for cnt in contours:
            pixel_area = cv2.contourArea(cnt)
            # Filter negligible pixel clusters
            if pixel_area < 35:
                continue

            # Calculate Ground Area in square meters (GSD = 0.25m -> 1px = 0.0625 m²)
            ground_area_m2 = round(pixel_area * (self.gsd ** 2), 2)
            total_plastic_area_m2 += ground_area_m2

            # Estimate plastic tonnage based on compaction rate (~25 kg/m² for typical Indian urban open dump)
            estimated_tonnage = round(ground_area_m2 * 0.026, 2)
            total_plastic_tonnage += estimated_tonnage

            # Bounding box & Centroid
            x, y, w, h = cv2.boundingRect(cnt)
            centroid_x = x + w // 2
            centroid_y = y + h // 2
            lat, lon = self.pixel_to_latlon(centroid_x, centroid_y, width, height)

            # Assign Severity Rating
            if ground_area_m2 > 120 or estimated_tonnage > 3.0:
                severity = "CRITICAL"
                box_color = (0, 0, 235)  # Crimson Red
            elif ground_area_m2 > 65 or estimated_tonnage > 1.6:
                severity = "SEVERE"
                box_color = (0, 140, 255)  # Orange
            elif ground_area_m2 > 30 or estimated_tonnage > 0.7:
                severity = "MODERATE"
                box_color = (0, 220, 255)  # Amber / Yellow
            else:
                severity = "LOW"
                box_color = (50, 220, 50)  # Green

            # Match nearest landmark
            nearest_landmark = self._find_nearest_landmark(centroid_x, centroid_y)

            # Draw on annotated image
            # Bounding rectangle
            cv2.rectangle(annotated, (x, y), (x + w, y + h), box_color, 2)
            # Centroid crosshair
            cv2.drawMarker(annotated, (centroid_x, centroid_y), box_color, cv2.MARKER_CROSS, 10, 1)
            # Label
            label = f"ID#{detection_id} {severity} [{estimated_tonnage}t]"
            cv2.putText(annotated, label, (x, max(y - 6, 12)), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1, cv2.LINE_AA)

            detections.append({
                "id": f"CLUST-W111-{detection_id:03d}",
                "name": nearest_landmark["name"],
                "latitude": lat,
                "longitude": lon,
                "pixel_x": centroid_x,
                "pixel_y": centroid_y,
                "bbox": [int(x), int(y), int(w), int(h)],
                "pixel_area": int(pixel_area),
                "ground_area_m2": ground_area_m2,
                "estimated_tonnage": estimated_tonnage,
                "severity": severity,
                "active_worm_units": 0,
                "digestion_rate_kg_day": 0.0,
                "days_to_neutralize": 0,
            })
            detection_id += 1

        # Sort detections by severity descending
        severity_order = {"CRITICAL": 4, "SEVERE": 3, "MODERATE": 2, "LOW": 1}
        detections.sort(key=lambda d: severity_order.get(d["severity"], 0), reverse=True)

        # HUD Overlay on top of annotated frame
        cv2.rectangle(annotated, (0, 0), (width, 36), (15, 20, 25), -1)
        hud_text = f"EcoSentinel Shanthi Nagar | Detections: {len(detections)} | Area: {total_plastic_area_m2:.1f} m2 | Est. Plastic: {total_plastic_tonnage:.2f} t"
        cv2.putText(annotated, hud_text, (12, 24), cv2.FONT_HERSHEY_SIMPLEX, 0.48, (0, 255, 180), 1, cv2.LINE_AA)

        # Convert images to base64
        raw_b64 = self._encode_image_b64(image)
        mask_b64 = self._encode_image_b64(cv2.cvtColor(clean_mask, cv2.COLOR_GRAY2BGR))
        annotated_b64 = self._encode_image_b64(annotated)

        return {
            "timestamp": "2026-09-09T11:00:00+05:30",
            "region": "Bengaluru Ward 111 (Shanthi Nagar / K.H. Double Road)",
            "gsd_meters_per_pixel": self.gsd,
            "total_detections": len(detections),
            "total_plastic_area_m2": round(total_plastic_area_m2, 2),
            "total_plastic_tonnage": round(total_plastic_tonnage, 2),
            "detections": detections,
            "images": {
                "raw_aerial": f"data:image/jpeg;base64,{raw_b64}",
                "hsv_mask": f"data:image/jpeg;base64,{mask_b64}",
                "annotated": f"data:image/jpeg;base64,{annotated_b64}",
            }
        }

    def _find_nearest_landmark(self, px: int, py: int) -> Dict[str, Any]:
        """Find the closest landmark name based on pixel distance."""
        best_landmark = self.landmark_anchors[0]
        min_dist = float("inf")
        for landmark in self.landmark_anchors:
            dist = np.hypot(landmark["pixel_x"] - px, landmark["pixel_y"] - py)
            if dist < min_dist:
                min_dist = dist
                best_landmark = landmark
        return best_landmark

    def _encode_image_b64(self, img: np.ndarray, quality: int = 85) -> str:
        """Helper to compress and convert OpenCV image to base64 JPEG string."""
        encode_params = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
        _, buffer = cv2.imencode('.jpg', img, encode_params)
        return base64.b64encode(buffer).decode('utf-8')
