import http from "@/api";
import axios from "axios";

class FileApi {
  // 图片上传
  uploadFile(params: FormData) {
    return http.post(`/file/upload`, params);
  }
  getImportFailFile(params = {}) {
    return http.download(`/sys/task/getImportFailFile`, params);
  }

  downloadFile(url: string, name = "文件") {
    const fileType = url.substring(url.lastIndexOf("."));
    console.log(fileType);
    axios({
      url: url,
      method: "GET",
      responseType: "blob"
    }).then((res: any) => {
      if (res.data.size > 0) {
        const content = res.data;
        const blob = new Blob([content]);
        const fileName = `${name}${fileType}`;
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        }
      }
    });
  }
}

const fileApi = new FileApi();
export default fileApi;
