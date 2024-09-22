function objectToCSVRow(dataObject: any[]) {
    let dataArray = [];
    for (let o in dataObject) {
        let innerValue =
            typeof dataObject[o] == "undefined"
                ? ""
                : dataObject[o]?.toString();
        const valueNot = innerValue || "";
        let result = valueNot?.replace(/"/g, '""');
        result = '"' + result + '"';
        dataArray.push(result);
    }
    return dataArray.join(";") + "\r\n";
}

function findbystring(o: { [x: string]: any }, s: string) {
    s = s.replace(/\[(\w+)\]/g, ".$1");
    s = s.replace(/^\./, "");
    let a = s.split(".");
    for (let i = 0, n = a.length; i < n; ++i) {
        let k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

function pushUnique(arr: any[], item: string) {
    if (item != "" && !arr.includes(item)) arr.push(item);
}

function getLabels(name: string, item: { [x: string]: any }, labels: any[]) {
    if (typeof item == "object") {
        for (let index in item) {
            let thisname = "";
            if (name != "") thisname = name + ".";
            thisname += index;
            getLabels(thisname, item[index], labels);
        }
    } else {
        pushUnique(labels, name);
    }
}

export function convertJsonToCSV(data: any[]) {
    const jsonObject = JSON.stringify(data, null, 2);
    let array =
        typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;
    let str = "";

    let labels: never[] = [];

    for (let i = 0; i < array.length; i++) {
        getLabels("", array[i], labels);
    }

    str += objectToCSVRow(labels);

    for (let i = 0; i < array.length; i++) {
        let line = [];
        for (let label in labels) {
            line.push(findbystring(array[i], labels[label]));
        }

        str += objectToCSVRow(line);
    }

    return str;
}

export const downloadBlobAsFile = function (data: any, filename: string) {
    let downloadLink = document.createElement("a");
    let blob = new Blob([data], { type: "text/csv" });
    let url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = `${filename}.csv`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};

export function convertCsv2Json(csv: any) {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split(";");

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        const obj: any = {};
        const currentline = lines[i].split(";");

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result;
}
