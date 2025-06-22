package com.url.shortener.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import javax.imageio.ImageIO;

@Service
public class QRCodeService {

    public byte[] generateQRCodeImage(String text, int width, int height) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

        // Create a new image with white background and border
        BufferedImage finalImage = new BufferedImage(width + 40, height + 60, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = finalImage.createGraphics();

        // Set white background
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, width + 40, height + 60);

        // Draw the QR code
        g2d.drawImage(qrImage, 20, 20, null);

        // Add "TinyGo" text at the bottom
        g2d.setColor(Color.BLACK);
        g2d.setFont(new Font("Arial", Font.BOLD, 14));
        FontMetrics fm = g2d.getFontMetrics();
        String text2 = "TinyGo";
        int textWidth = fm.stringWidth(text2);
        int x = (width + 40 - textWidth) / 2;
        g2d.drawString(text2, x, height + 45);

        g2d.dispose();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(finalImage, "PNG", outputStream);
        return outputStream.toByteArray();
    }

    public byte[] generateQRCodeImageSimple(String text, int width, int height) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(qrImage, "PNG", outputStream);
        return outputStream.toByteArray();
    }
}
