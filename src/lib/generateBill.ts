import { Transaction } from "@/app/Modals/modal";
import html2canvas from "html2canvas";
import { jsPDF } from 'jspdf';
import { coffee0 } from '@/assets/Media';
export const generateBill = async (transaction: Transaction) => {
    const pdfDoc = new jsPDF('p', 'pt', 'a4');
    const invoiceContainer = document.createElement('div');
    invoiceContainer.innerHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
      <header style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div>
          <img src=${coffee0} alt="Coffee Shop Logo" width="100" height="50" />
        </div>
        <h1 style="flex: 1; text-align: center;">INVOICE</h1>
        <div>
          <p><strong>Order ID:</strong> ${transaction.orderId}</p>
          <p><strong>Date Issued:</strong> ${transaction.date}</p>
        </div>
      </header>

      <section>
        <h3>BILLING TO:</h3>
        <p><strong>${transaction.username}</strong></p>
        <p>Street Name 10019, NY</p>
      </section>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">Product</th>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">Price</th>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">Qty</th>
            <th style="border-bottom: 1px solid #ddd; padding: 8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${transaction.items.map(item => `
            <tr>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${item.name}</td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">$${item.pricePerQuantity.toFixed(2)}</td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
              <td style="border-bottom: 1px solid #ddd; padding: 8px;">$${(item.pricePerQuantity * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <section style="text-align: right;">
        <p><strong>Subtotal:</strong> $${transaction.totalAmount.toFixed(2)}</p>
        <p><strong>Total:</strong> $${transaction.totalAmount.toFixed(2)}</p>
      </section>

      <footer style="margin-top: 40px;">
        <p><strong>Order Status:</strong> ${transaction.orderDelivered ? "Delivered" : "Pending"}</p>
      </footer>
    </div>
  `;

    document.body.appendChild(invoiceContainer);

    // Generate the PDF from the HTML content
    const canvas = await html2canvas(invoiceContainer);
    const imgData = canvas.toDataURL('image/png');
    pdfDoc.addImage(imgData, 'PNG', 0, 0, 595, 842);

    // Automatically download the PDF
    pdfDoc.save(`Invoice_${transaction.orderId}.pdf`);

    // Clean up the temporary container
    document.body.removeChild(invoiceContainer);
}