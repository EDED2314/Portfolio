CAM
As part of the sensor suit that goes in the avionics bay of our rockets, I designed, assembled, and brought up the third major revision of our live video system boards. 

Before I joined, the team implemented a 1.2 GHz analog video system that communicated with an external transmitter and receiver. It supported two Runcam Split 4s, allowed for seamless switching between the two, but posed many challenges. 

One of the major issues that came with this board was its interference with the GPS on the AV bay, since both of them used the 1.2 GHz band for their communication. This issue was seen in their 2025 summer launch at FAR, where the GPS lost lock for a duration of time, and CAM had to be manually turned off via commands sent from the ground station; only then did the GPS lock come back.

To improve on last year’s design, we looked at choosing our own transceivers and implementing our own packet design and protocols. Hence, my design for this year was to implement a pipeline to convert NTSC (analog video from the Runcams) to digital video, then compress that digital video data and send it via a digital transceiver.

*image of diagram showing conversion process/toolchain*

Feel free to take a look at our schematics for the first revision of this board here, or by viewing the photos to the side. 

For our transceiver, we initially chose a Si4463 module by NiceRF, as the SI4463 supported 1Mbps FSK, a reasonable speed for transmitting video. 

Due to issues with writing successful drivers for the Si4463 to transmit at 1Mbps and amplifier problems on EAGLE (our receiver board), we later switched to the LR2021 in a second revision. Amazingly, it supported FLRC at 2.6 Mbps as well as FSK at 1 Mbps at 434 MHz frequencies, and FSK at 2 Mbps for frequencies around 915 MHz, as well as many more features such as ranging.

For our MCU, we used the ESP32-P4, a fairly new chip from Espressif that supported hardware and software JPEG, H.264, and YUV42X compression. This chip also supports a native digital video port (DVP) interface, allowing DMA and fast copying of digital video from our ADC to memory.

For the conversion from analog video to digital video, we chose the TVP5151. It converts NTSC video (analog) into YUV422 video (digital). Despite seeming pretty straightforward, the implementation was a bit more complicated. The TVP5151’s wiring required 8 data channels, along with an external 27 MHz clock for video synchronization. This chip has cost the team and I much headache as soldering it takes great patience and detail (it took us a good 35-50 resolders to get all of them working through all the revisions we made throughout the year).

For this design, I also employed the same camera power toggle chip that was used on the last major revision of the board. Additionally, we added two I2C lines, one for internal board communication with chips, and one for board-to-board communication between MIDAS (our in-house flight computer) and CAM. 

Lastly, for debugging, there are the standard LEDs and the buzzer, as well as USB-C.

Overall, there are 1.8V, 3.3V, and 5.5V power rails throughout the board, requiring three buck converters, greatly increasing wiring and component complexity. 

Over the course of the year, we assembled and brought up four (or five?) CAMs, spanning across three minor revisions. I don’t think this one sentence does justice to the amount of time it actually took 😂. 

For the CAM firmware, I wrote drivers for the TVP5151, DVP interface, hardware encoder, and for testing LR2021 FLRC and FSK. 

For the DVP interface, we had to modify and use internal files from the existing esp_video library provided by Espressif due to our “video device” being an ADC instead of an actual camera. Also, due to difficulties in integrating the H264 hardware encoder successfully, we opted for a less powerful JPEG encoding. 

For the LR2021, we settled for FSK due to having difficulties getting FLRC to work. From our benchmarks, we achieved a transmission rate of around 877 Mbps (see image below) by using the 255-byte Tx FIFO on the chip.

To transmit image buffers that are much longer than the 255-byte packet size supported by FSK, I implemented fragmentation algorithms and packet headers to transmit and reconstruct images via multiple sends.

Furthermore, we implemented a Reed-Solomon correction scheme to recover corrupted data during transmission. 

Check out our boards: https://github.com/ISSUIUC/ISS-PCB 