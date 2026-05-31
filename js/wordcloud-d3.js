// Word Cloud Generator using d3-cloud library
document.addEventListener('DOMContentLoaded', function () {
    // Wait for d3 to load
    if (typeof d3 === 'undefined' || typeof d3.layout === 'undefined' || typeof d3.layout.cloud === 'undefined') {
        console.error('d3-cloud library not loaded');
        return;
    }

    const wordCloudContainer = document.getElementById('word-cloud-svg');
    if (!wordCloudContainer) return;

    const regenerateBtn = document.getElementById('regenerate-cloud');

    // Word data with sizes and categories
    const words = [
        { text: "Live Video System", size: 40, category: "primary" },
        { text: "Rocket Avionics", size: 38, category: "primary" },
        { text: "ESP32-P4", size: 30, category: "secondary" },
        { text: "Digital Compression", size: 28, category: "secondary" },
        { text: "JPEG Encoding", size: 28, category: "secondary" },
        { text: "Analog to Digital", size: 26, category: "secondary" },
        { text: "TVP5151", size: 22, category: "tertiary" },
        { text: "LR2021", size: 22, category: "tertiary" },
        { text: "FSK Transmission", size: 20, category: "tertiary" },
        { text: "434 MHz", size: 20, category: "tertiary" },
        { text: "Packet Fragmentation", size: 18, category: "tertiary" },
        { text: "Reed-Solomon", size: 16, category: "quaternary" },
        { text: "DVP Interface", size: 16, category: "quaternary" },
        { text: "YUV422", size: 14, category: "quaternary" },
        { text: "Hardware Encoder", size: 14, category: "quaternary" },
        { text: "Wireless Video", size: 24, category: "secondary" },
        { text: "PCB Design", size: 22, category: "tertiary" },
        { text: "KiCad", size: 18, category: "tertiary" },
        { text: "Firmware", size: 20, category: "tertiary" },
        { text: "Embedded Systems", size: 24, category: "secondary" },
        { text: "Real-time Processing", size: 18, category: "tertiary" },
        { text: "DMA Transfer", size: 16, category: "quaternary" },
        { text: "I2C Communication", size: 16, category: "quaternary" },
        { text: "Power Management", size: 18, category: "tertiary" },
        { text: "Buck Converter", size: 14, category: "quaternary" },
        { text: "GPS Integration", size: 16, category: "quaternary" },
        { text: "NTSC Video", size: 16, category: "quaternary" },
        { text: "Runcam Split 4", size: 14, category: "quaternary" },
        { text: "Error Correction", size: 18, category: "tertiary" },
        { text: "Video Pipeline", size: 20, category: "tertiary" },
        { text: "RF Design", size: 18, category: "tertiary" },
        { text: "Telemetry", size: 16, category: "quaternary" },
        { text: "Flight Computer", size: 18, category: "tertiary" },
        { text: "MIDAS", size: 14, category: "quaternary" },
        { text: "Sensor Suite", size: 16, category: "quaternary" }
    ];

    // Color mapping for categories
    const colorMap = {
        primary: "#2563eb",
        secondary: "#7c3aed",
        tertiary: "#dc2626",
        quaternary: "#059669"
    };

    const containerWidth = wordCloudContainer.offsetWidth;
    const containerHeight = 350;

    fontScale = 1;
    padding = 8;

    if (containerWidth < 800) {
        fontScale = 0.8;
        padding = 7;
    }
    if (containerWidth < 600) {
        fontScale = 0.7;
        padding = 5;
    }
    if (containerWidth < 400) {
        fontScale = 0.6;
        padding = 3;
    }

    console.log(fontScale);
    console.log(padding);

    function generateCloud() {
        // Create word cloud layout
        const layout = d3.layout.cloud()
            .size([containerWidth, containerHeight])
            .words(words.map(d => ({
                text: d.text,
                size: d.size * fontScale,
                category: d.category
            })))
            .padding(padding)
            .rotate(() => 0)
            .font("Helvetica Neue, Helvetica, Arial, sans-serif")
            .fontSize(d => d.size)
            .spiral("archimedean")
            .on("end", draw);

        layout.start();
    }

    // Initial generation
    generateCloud();

    // Regenerate button click handler
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', generateCloud);
    }

    function draw(words) {
        // Clear any existing content
        wordCloudContainer.innerHTML = '';

        // Create SVG using d3
        const svg = d3.select("#word-cloud-svg")
            .append("svg")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
            .append("g")
            .attr("transform", `translate(${containerWidth / 2},${containerHeight / 2})`);

        // Add words
        const text = svg.selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .style("font-size", d => d.size + "px")
            .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
            .style("font-weight", d => d.size > 25 ? 700 : 600)
            .style("fill", d => colorMap[d.category])
            .style("cursor", "default")
            .style("opacity", 0)
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
            .text(d => d.text);

        // Animate in with stagger
        text.transition()
            .duration(500)
            .delay((d, i) => i * 50)
            .style("opacity", 1);

        // Add hover effects - scale around the word's center
        text.on("mouseenter", function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("transform", `translate(${d.x},${d.y})rotate(${d.rotate})scale(1.15)`)
                .style("filter", "brightness(0.8)");
        })
            .on("mouseleave", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("transform", `translate(${d.x},${d.y})rotate(${d.rotate})`)
                    .style("filter", "brightness(1)");
            });
    }

    // Redraw on window resize
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newWidth = wordCloudContainer.offsetWidth;
            if (Math.abs(newWidth - containerWidth) > 50) {
                generateCloud();
            }
        }, 500);
    });
});
