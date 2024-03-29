import L, {Icon, Marker} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useMap from '../../hooks/use-map';
import {useRef, useEffect} from 'react';
import {URL_MARKER_DEFAULT, URL_MARKER_CURRENT} from '../../const';
import {Offer, City} from '../../types/offer';

type MapProps = {
  offers: Offer[];
  activeCard ? : Offer | undefined;
  city: City;
  activeOffer ? : Offer | undefined;
};

const defaultCustomIcon = new Icon({
  iconUrl: URL_MARKER_DEFAULT,
  iconSize: [27, 39],
  iconAnchor: [13, 39],
});

const currentCustomIcon = new Icon({
  iconUrl: URL_MARKER_CURRENT,
  iconSize: [27, 39],
  iconAnchor: [13, 39],
});

const markerGroup = L.layerGroup();

const addMarkers = (map: L.Map | null, offers: Offer[], activeCard: Offer | undefined, activeOffer: Offer | undefined, city: City) => {
  if (map) {
    map.removeLayer(markerGroup);
    markerGroup.clearLayers();

    map.setView({
      lat: city.location.latitude,
      lng: city.location.longitude,
    }, city.location.zoom);

    offers.forEach((offer) => {
      const marker = new Marker({
        lat: offer.location.latitude,
        lng: offer.location.longitude,
      });

      marker
        .setIcon(
          activeCard === offer
            ? currentCustomIcon
            : defaultCustomIcon
        )
        .addTo(markerGroup);
    });

    if (activeOffer) {
      const marker = new Marker({
        lat: activeOffer.location.latitude,
        lng: activeOffer.location.longitude,
      });

      marker
        .setIcon(currentCustomIcon)
        .addTo(markerGroup);
    }
    map.addLayer(markerGroup);
  }
};

function Map ({offers, activeCard, city, activeOffer}: MapProps): JSX.Element {

  const mapRef = useRef(null);
  const map = useMap(mapRef, city);
  addMarkers(map, offers, activeCard, activeOffer, city);

  useEffect(() => {
    addMarkers(map, offers, activeCard, activeOffer, city);
  }, [activeCard, activeOffer, city, map, offers]);

  return (
    <div
      style={{height: '100%'}}
      ref={mapRef}
      data-testid="map"
    >
    </div>
  );
}

export default Map;
