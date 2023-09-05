"""
This part of the workflow summarizes sequence counts from existing metadata for a
data provenance, variant classification system, and geo-resolution.
"""

rule fetch_metadata:
    output:
        metadata = temp("data/{data_provenance}/metadata.tsv")
    params:
        s3_src = lambda w: config[w.data_provenance]["s3_metadata"]
    benchmark:
        "benchmarks/{data_provenance}/fetch_metadata.txt"
    shell:
        """
        ./vendored/download-from-s3 {params.s3_src:q} {output.metadata}
        """


rule subset_metadata:
    input:
        metadata = "data/{data_provenance}/metadata.tsv"
    output:
        subset_metadata = "data/{data_provenance}/subset_metadata.tsv"
    params:
        subset_columns = lambda w: ",".join(config[w.data_provenance]["subset_columns"])
    benchmark:
        "benchmarks/{data_provenance}/subset_metadata.txt"
    shell:
        """
        tsv-select -H \
            -f {params.subset_columns:q} \
            {input.metadata} > {output.subset_metadata}
        """


rule summarize_clade_sequence_counts:
    input:
        subset_metadata = "data/{data_provenance}/subset_metadata.tsv"
    output:
        clade_seq_counts = "results/{data_provenance}/{variant_classification}/{geo_resolution}.tsv"
    params:
        seq_count_options = lambda w: config[w.data_provenance][w.variant_classification][w.geo_resolution]["seq_count_options"]
    benchmark:
        "benchmarks/{data_provenance}/{variant_classification}/{geo_resolution}/summarize_clade_sequence_counts.txt"
    shell:
        """
        ./bin/summarize-clade-sequence-counts \
            --metadata {input.subset_metadata} \
            --output {output.clade_seq_counts} \
            {params.seq_count_options}
        """


def _get_s3_url(w, input_file):
    s3_dst = config["s3_dst"].rstrip("/")
    s3_filepath = input_file.lstrip("results/") + ".gz"

    return f"{s3_dst}/{s3_filepath}"


rule upload_sequence_count:
    input:
        clade_seq_counts = "results/{data_provenance}/{variant_classification}/{geo_resolution}.tsv"
    output: touch("results/{data_provenance}/{variant_classification}/{geo_resolution}_upload.done")
    params:
        s3_url = lambda w, input: _get_s3_url(w, input[0])
    benchmark:
        "benchmarks/{data_provenance}/{variant_classification}/{geo_resolution}/upload_sequence_counts.txt"
    shell:
        """
        ./vendored/upload-to-s3 {input.clade_seq_counts} {params.s3_url:q}
        """
