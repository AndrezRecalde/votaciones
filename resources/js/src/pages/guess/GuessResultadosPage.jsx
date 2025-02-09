import { Box } from "@mantine/core";
import { useCallback, useEffect, useRef } from "react";
import {
    useDignidadStore,
    //useJurisdiccionStore,
    useResultadoStore,
} from "../../hooks";
import mapboxgl from "mapbox-gl";
import geojson from "../../helpers/geo.json";
import classes from "../../assets/styles/modules/map-box/MapContainer.module.css";
import { MapResultadosDrawer } from "../../components";
import Swal from "sweetalert2";

const initialPoints = {
    longitud: -78.5,
    latitud: 0.6316,
    zoom: 8.0,
};

const GuessResultadosPage = () => {
    const mapContainerRef = useRef();
    const mapRef = useRef();

    const setRef = useCallback((node) => {
        mapContainerRef.current = node;
    }, []);

    /* const { startLoadCantonesGuess } = useJurisdiccionStore(); */
    const { startLoadDignidadesGuess } = useDignidadStore();
    const { resultadosForMap, message, errores } = useResultadoStore();

    const cantonColors = {};
    resultadosForMap?.forEach((item) => {
        cantonColors[item.nombre_canton] =
            item.dignidades[0]?.candidatos[0]?.color || "#dfe5f5";
    });

    useEffect(() => {
        //startLoadCantonesGuess({ provincia_id: 8 });
        startLoadDignidadesGuess({ activo: true });
    }, []);

    useEffect(() => {
        if (message !== undefined) {
            Swal.fire({
                icon: message.status,
                text: message.msg,
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }
    }, [message]);

    useEffect(() => {
        if (errores !== undefined) {
            Swal.fire({
                icon: "error",
                title: "Opps...",
                text: errores,
                confirmButtonColor: "#094293",
            });
            return;
        }
    }, [errores]);

    useEffect(() => {
        mapboxgl.accessToken =
            "pk.eyJ1IjoiY3JpenJlYyIsImEiOiJja3o1a2cwcGEwcjhsMnVwaDF1bHFwcGQ5In0.Sc89V12iymN-XYY89D5TeA";

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: "mapbox://styles/mapbox/light-v11",
            center: [initialPoints.longitud, initialPoints.latitud],
            zoom: initialPoints.zoom,
        });

        let hoveredPolygonId = null;

        mapRef.current.on("load", () => {
            mapRef.current.addSource("states", {
                type: "geojson",
                data: geojson,
            });

            // The feature-state dependent fill-opacity expression will render the hover effect
            // when a feature's hover state is set to true.
            mapRef.current.addLayer({
                id: "state-fills",
                type: "fill",
                source: "states",
                layout: {},
                paint: {
                    "fill-color": [
                        "match",
                        ["get", "DPA_DESCAN"],
                        ...Object.entries(cantonColors).flat(),
                        "#dfe5f5", // Color por defecto si no hay coincidencia
                    ],
                    "fill-opacity": [
                        "case",
                        ["boolean", ["feature-state", "hover"], false],
                        1,
                        0.5,
                    ],
                },
            });

            mapRef.current.addLayer({
                id: "state-borders",
                type: "line",
                source: "states",
                layout: {},
                paint: {
                    "line-color": "#4a4949",
                    "line-width": 2,
                },
            });
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
            });

            mapRef.current.on("mousemove", "state-fills", (e) => {
                //hoveredPolygonId = canton_id
                let nombre_canton = e.features[0].properties.DPA_DESCAN;
                let html = "";
                //console.log(hoveredPolygonId);

                if (e.features.length > 0) {
                    if (hoveredPolygonId !== null) {
                        mapRef.current.setFeatureState(
                            { source: "states", id: hoveredPolygonId },
                            { hover: false }
                        );
                    }
                    hoveredPolygonId = e.features[0].id;
                    mapRef.current.setFeatureState(
                        { source: "states", id: hoveredPolygonId },
                        { hover: true }
                    );
                }

                resultadosForMap?.map((item) => {
                    if (item?.id === hoveredPolygonId) {
                        html = `
                            <h4>${hoveredPolygonId} - ${nombre_canton}</h4>
                        `;
                        item?.dignidades?.map((dignidad) => {
                            html += `
                                <p>${dignidad.dignidad}</p>
                            `;
                            html += `
                                <table border="1" style="
                                        border-collapse: collapse;
                                        width: 100%;
                                        text-align: left;
                                        font-family: 'Poppins', sans-serif;
                                        font-size: 14px;
                                        padding: 8px;"
                                >
                                    <thead>
                                        <tr>
                                            <th style="padding: 8px;">Candidato</th>
                                            <th style="padding: 8px;">Votos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                            `;
                            dignidad?.candidatos?.map((candidato) => {
                                html += `
                                            <tr>
                                                <td style="padding: 8px; background-color: ${
                                                    candidato?.color ||
                                                    "#ebae44"
                                                };">${
                                    candidato?.nombre_candidato
                                }</td>
                                                <td style="padding: 8px;">${
                                                    candidato?.total_votos
                                                }</td>
                                            </tr>
                                `;
                            });
                            html += `
                                    </tbody>
                                </table>
                            `;
                        });
                    }
                });

                popup.setLngLat(e.lngLat).setHTML(html).addTo(mapRef.current);
                const popupContent = document.querySelector(
                    ".mapboxgl-popup-content"
                );
                if (popupContent) {
                    popupContent.style.width = "300px"; // Ajusta el ancho a 300px
                    popupContent.style.border = "2px solid #d5e7f2"; // Borde azul
                    popupContent.style.borderRadius = "10px"; // Bordes redondeados
                    popupContent.style.boxShadow =
                        "0px 4px 6px rgba(0, 0, 0, 0.1)"; // Sombra
                    popupContent.style.padding = "10px"; // Espaciado interno
                    popupContent.style.backgroundColor = "#ffffff"; // Fondo blanco
                }
            });

            mapRef.current.on("mouseleave", "state-fills", () => {
                if (hoveredPolygonId !== null) {
                    mapRef.current.setFeatureState(
                        { source: "states", id: hoveredPolygonId },
                        { hover: false }
                    );
                }
                hoveredPolygonId = null;
                popup.remove();
            });
        });
    }, [resultadosForMap]);

    return (
        <Box>
            <div id="root" ref={setRef} className={classes.mapContainer} />
            <MapResultadosDrawer />
        </Box>
    );
};

export default GuessResultadosPage;
